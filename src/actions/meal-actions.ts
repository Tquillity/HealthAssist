'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { endOfWeek, startOfWeek } from 'date-fns';

export async function getWeeklyPlan(date = new Date()) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error('Unauthorized');

  const membership = await prisma.member.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  if (!membership) throw new Error('No household found');

  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  let plan = await prisma.mealPlan.findFirst({
    where: {
      organizationId: membership.organizationId,
      startDate: start,
    },
    include: {
      items: {
        include: { recipe: true },
      },
    },
  });

  if (!plan) {
    plan = await prisma.mealPlan.create({
      data: {
        organizationId: membership.organizationId,
        startDate: start,
        endDate: end,
      },
      include: {
        items: { include: { recipe: true } },
      },
    });
  }

  return { plan, recipes: await getAvailableRecipes(membership.organizationId) };
}

async function getAvailableRecipes(orgId: string) {
  return await prisma.recipe.findMany({
    where: {
      OR: [{ isSystem: true }, { organizationId: orgId }],
    },
    select: { id: true, name: true, category: true, imageUrl: true },
  });
}

export async function addMealToPlan(
  planId: string,
  recipeId: string,
  dateStr: string,
  mealType: string
) {
  try {
    const date = new Date(dateStr);

    await prisma.mealPlanItem.create({
      data: {
        mealPlanId: planId,
        recipeId,
        date,
        mealType,
        servings: 4,
      },
    });

    revalidatePath('/meal-planner');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to add meal' };
  }
}

export async function removeMealFromPlan(itemId: string) {
  try {
    await prisma.mealPlanItem.delete({
      where: { id: itemId },
    });
    revalidatePath('/meal-planner');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}


