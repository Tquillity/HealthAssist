// Load environment variables FIRST - use dotenv/config side-effect import
import 'dotenv/config';

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashPassword } from 'better-auth/crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface KitchenManifestRecipe {
  name: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  tags?: string[];
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
    melted?: boolean;
  }>;
  instructions: Array<{
    stepNumber: number;
    text: string;
  }>;
}

interface KitchenManifestRoutine {
  name: string;
  description?: string;
  category?: string;
  frequency: string;
}

interface KitchenManifest {
  recipes: KitchenManifestRecipe[];
  routines?: KitchenManifestRoutine[];
}

async function seed() {
  console.log('🌱 Starting database seed...');
  
  /**
   * For local scripts (Node.js runtime), we use the standard PostgreSQL adapter.
   * Prisma 7 requires an adapter when driverAdapters is enabled in the schema.
   * The Serverless Adapter (Neon) is primarily for the Next.js runtime (Vercel/Edge).
   */
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in your .env file');
    process.exit(1);
  }

  // Create a standard PostgreSQL pool for local scripts
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    // 1. Verify Connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    // 2. Seed Admin User
    console.log('👤 Seeding admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@healthassist.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    // Better-Auth expects its own password hash format (scrypt: "salt:hexkey")
    const hashedPassword = await hashPassword(adminPassword);

    const adminUser =
      existingAdmin ??
      (await prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

    if (existingAdmin) {
      console.log(`⚠️ Admin user already exists: ${adminEmail} (repairing password hash if needed)`);
    }

    /**
     * Ensure credential account exists AND has a valid Better-Auth password hash.
     * We force-replace any existing credential accounts to avoid duplicates
     * (Better-Auth may read the "wrong" one if multiple exist).
     */
    await prisma.account.deleteMany({
      where: {
        userId: adminUser.id,
        providerId: 'credential',
      },
    });

    await prisma.account.create({
      data: {
        id: `account_${adminUser.id}`,
        userId: adminUser.id,
        accountId: adminUser.id,
        providerId: 'credential',
        password: hashedPassword,
      },
    });

    // Ensure default org + membership exist (safe on re-run)
    const defaultOrgId = `org_${adminUser.id}`;
    const defaultMemberId = `member_${adminUser.id}`;

    const existingOrg = await prisma.organization.findUnique({
      where: { id: defaultOrgId },
    });

    const defaultOrg =
      existingOrg ??
      (await prisma.organization.create({
        data: {
          id: defaultOrgId,
          name: `${adminName}'s Household`,
          slug: `admin-household`,
          createdAt: new Date(),
        },
      }));

    const existingMember = await prisma.member.findUnique({
      where: { id: defaultMemberId },
    });

    if (!existingMember) {
      await prisma.member.create({
        data: {
          id: defaultMemberId,
          organizationId: defaultOrg.id,
          userId: adminUser.id,
          role: 'owner',
          createdAt: new Date(),
        },
      });
    }

    console.log(`✅ Admin credentials ready`);
    console.log(`\n  📧 ADMIN CREDENTIALS:`);
    console.log(`     Email: ${adminEmail}`);
    console.log(`     Password: ${adminPassword}`);
    console.log(`\n  ⚠️  Save these credentials - you'll need them to sign in!\n`);

    // 3. Load and Seed Recipes
    const manifestPath = path.join(__dirname, 'kitchen-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as KitchenManifest;

    console.log(`📝 Seeding ${manifest.recipes.length} recipes...`);
    for (const recipeData of manifest.recipes) {
      // Check if recipe exists to avoid duplicates on re-run
      const existingRecipe = await prisma.recipe.findFirst({ where: { name: recipeData.name }});
      if (existingRecipe) {
        console.log(`  ⏭️  Recipe already exists: ${recipeData.name}`);
        continue;
      }

      await prisma.$transaction(async (tx) => {
        const recipe = await tx.recipe.create({
          data: {
            name: recipeData.name,
            description: recipeData.description || null,
            prepTime: recipeData.prepTime || null,
            cookTime: recipeData.cookTime || null,
            servings: recipeData.servings || null,
            category: recipeData.category || null,
            tags: recipeData.tags || [],
            isSystem: true,
            organizationId: null,
          },
        });

        await tx.ingredient.createMany({
          data: recipeData.ingredients.map(ing => ({
            recipeId: recipe.id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes || null,
          })),
        });

        await tx.instruction.createMany({
          data: recipeData.instructions.map(inst => ({
            recipeId: recipe.id,
            stepNumber: inst.stepNumber,
            text: inst.text,
          })),
        });
      });
      console.log(`  ✅ Recipe: ${recipeData.name}`);
    }

    // 4. Seed Routines
    if (manifest.routines && manifest.routines.length > 0) {
      console.log(`🏃 Seeding ${manifest.routines.length} routines...`);
      for (const routineData of manifest.routines) {
        // Check if routine exists to avoid duplicates on re-run
        const existingRoutine = await prisma.routine.findFirst({ where: { name: routineData.name }});
        if (existingRoutine) {
          console.log(`  ⏭️  Routine already exists: ${routineData.name}`);
          continue;
        }

        await prisma.routine.create({
          data: {
            name: routineData.name,
            description: routineData.description || null,
            category: routineData.category || null,
            frequency: routineData.frequency,
            isSystem: true,
            organizationId: null,
          },
        });
        console.log(`  ✅ Routine: ${routineData.name}`);
      }
    }

    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();
