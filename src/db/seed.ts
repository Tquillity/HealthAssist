// Load environment variables FIRST - use dotenv/config side-effect import
import 'dotenv/config';

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Configure WebSocket for Node.js (required for Neon serverless)
neonConfig.webSocketConstructor = ws;

// Create Prisma client in seed script to ensure DATABASE_URL is available
// We create it here instead of importing from lib/db to avoid module initialization timing issues
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create pool with connection string
// Note: Pool may need the connection string passed differently
const pool = new Pool({ connectionString });

// Verify pool was created correctly
console.log('🔍 Pool options connectionString:', pool.options?.connectionString ? 'SET' : 'MISSING');

const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

// Test the connection immediately
try {
  await prisma.$queryRaw`SELECT 1 as test`;
  console.log('✅ Database connection test successful');
} catch (error) {
  console.error('❌ Database connection test failed:', error);
  throw error;
}

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

  try {
    // Seed Admin User and Default Organization
    console.log('👤 Seeding admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@healthassist.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(`  ⚠️  Admin user already exists: ${adminEmail}`);
    } else {
      // Hash password using bcryptjs (Better-Auth compatible)
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create account with hashed password (Better-Auth format)
      await prisma.account.create({
        data: {
          id: `account_${adminUser.id}`,
          userId: adminUser.id,
          accountId: adminUser.id,
          providerId: 'credential',
          password: hashedPassword,
        },
      });

      // Create default organization (household) for admin
      const defaultOrg = await prisma.organization.create({
        data: {
          id: `org_${adminUser.id}`,
          name: `${adminName}'s Household`,
          slug: `admin-household`,
          createdAt: new Date(),
        },
      });

      // Make admin a member of the organization with "owner" role
      await prisma.member.create({
        data: {
          id: `member_${adminUser.id}`,
          organizationId: defaultOrg.id,
          userId: adminUser.id,
          role: 'owner',
          createdAt: new Date(),
        },
      });

      console.log(`  ✅ Created admin user: ${adminEmail}`);
      console.log(`  ✅ Created default organization: ${defaultOrg.name}`);
      console.log(`\n  📧 ADMIN CREDENTIALS:`);
      console.log(`     Email: ${adminEmail}`);
      console.log(`     Password: ${adminPassword}`);
      console.log(`\n  ⚠️  Save these credentials - you'll need them to sign in!\n`);
    }

    // Load kitchen manifest JSON file
    const manifestPath = path.join(__dirname, 'kitchen-manifest.json');
    const manifestFile = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestFile) as KitchenManifest;

    // Seed Recipes
    console.log(`📝 Seeding ${manifest.recipes.length} recipes...`);
    for (const recipeData of manifest.recipes) {
      await prisma.$transaction(async (tx) => {
        // Create recipe
        const recipe = await tx.recipe.create({
          data: {
            name: recipeData.name,
            description: recipeData.description || null,
            prepTime: recipeData.prepTime || null,
            cookTime: recipeData.cookTime || null,
            servings: recipeData.servings || null,
            category: recipeData.category || null,
            tags: recipeData.tags || [],
            isSystem: true, // All kitchen manifest recipes are system recipes
            organizationId: null, // System recipes have no organization
          },
        });

        // Create ingredients
        if (recipeData.ingredients && recipeData.ingredients.length > 0) {
          await tx.ingredient.createMany({
            data: recipeData.ingredients.map((ing) => ({
              recipeId: recipe.id,
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              notes: ing.notes || null,
            })),
          });
        }

        // Create instructions
        if (recipeData.instructions && recipeData.instructions.length > 0) {
          await tx.instruction.createMany({
            data: recipeData.instructions.map((inst) => ({
              recipeId: recipe.id,
              stepNumber: inst.stepNumber,
              text: inst.text,
            })),
          });
        }

        console.log(`  ✅ Created recipe: ${recipe.name}`);
      });
    }

    // Seed Routines
    if (manifest.routines && manifest.routines.length > 0) {
      console.log(`🏃 Seeding ${manifest.routines.length} routines...`);
      for (const routineData of manifest.routines) {
        await prisma.routine.create({
          data: {
            name: routineData.name,
            description: routineData.description || null,
            category: routineData.category || null,
            frequency: routineData.frequency,
            isSystem: true, // All kitchen manifest routines are system routines
            organizationId: null, // System routines have no organization
          },
        });
        console.log(`  ✅ Created routine: ${routineData.name}`);
      }
    }

    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if this file is executed directly
seed()
  .then(() => {
    console.log('🎉 Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });

export default seed;
