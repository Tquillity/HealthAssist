import { prisma } from '@/lib/db';
import * as fs from 'fs';
import * as path from 'path';

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
