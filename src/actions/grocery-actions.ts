'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { Prisma } from '@prisma/client';

// Type for aggregated grocery item
export interface GroceryItem {
  name: string;
  unit: string;
  totalQuantity: number;
  recipes: Array<{
    recipeName: string;
    quantity: number;
    mealType: string;
    date: Date;
  }>;
}

// Type for the full grocery list response
export interface GroceryListResult {
  success: boolean;
  data?: GroceryItem[];
  error?: string;
}

/**
 * Get aggregated grocery list for an organization within a date range
 * @param organizationId - The organization (household) ID
 * @param startDate - Start date for the meal plan range
 * @param endDate - End date for the meal plan range
 * @returns Aggregated grocery list with ingredients grouped by name and unit
 */
export async function getGroceryList(
  organizationId: string,
  startDate: Date,
  endDate: Date
): Promise<GroceryListResult> {
  try {
    // Security check: Verify user belongs to the organization
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: 'Unauthorized: Please sign in',
      };
    }

    // Check if user is a member of the organization
    const membership = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        organizationId: organizationId,
      },
    });

    if (!membership) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this organization',
      };
    }

    // Fetch all meal plan items for the organization within the date range
    const mealPlanItems = await prisma.mealPlanItem.findMany({
      where: {
        mealPlan: {
          organizationId: organizationId,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        recipe: {
          include: {
            ingredients: true,
          },
        },
        mealPlan: true,
      },
    });

    // Aggregate ingredients
    // Key format: toLowerCase(name) + "_" + toLowerCase(unit)
    const ingredientMap = new Map<string, GroceryItem>();

    for (const item of mealPlanItems) {
      const recipe = item.recipe;
      const servingsMultiplier = item.servings;

      for (const ingredient of recipe.ingredients) {
        const key = `${ingredient.name.toLowerCase()}_${ingredient.unit.toLowerCase()}`;
        const adjustedQuantity = ingredient.quantity * servingsMultiplier;

        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.totalQuantity += adjustedQuantity;
          existing.recipes.push({
            recipeName: recipe.name,
            quantity: adjustedQuantity,
            mealType: item.mealType,
            date: item.date,
          });
        } else {
          ingredientMap.set(key, {
            name: ingredient.name,
            unit: ingredient.unit,
            totalQuantity: adjustedQuantity,
            recipes: [
              {
                recipeName: recipe.name,
                quantity: adjustedQuantity,
                mealType: item.mealType,
                date: item.date,
              },
            ],
          });
        }
      }
    }

    // Convert map to array and sort by name
    const groceryList = Array.from(ingredientMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      success: true,
      data: groceryList,
    };
  } catch (error) {
    console.error('Error generating grocery list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate grocery list',
    };
  }
}

/**
 * Get meal plans for an organization within a date range
 * Helper function for meal plan management
 */
export async function getMealPlans(
  organizationId: string,
  startDate: Date,
  endDate: Date
) {
  'use server';

  try {
    // Security check: Verify user belongs to the organization
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: 'Unauthorized: Please sign in',
      };
    }

    const membership = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        organizationId: organizationId,
      },
    });

    if (!membership) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this organization',
      };
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        organizationId: organizationId,
        startDate: {
          lte: endDate,
        },
        endDate: {
          gte: startDate,
        },
      },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: true,
              },
            },
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return {
      success: true,
      data: mealPlans,
    };
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch meal plans',
    };
  }
}
