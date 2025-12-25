'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Zod schemas
const CreateRoutineSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  frequency: z.string().optional(),
  energyLevel: z.enum(['low', 'medium', 'high']).default('medium'),
  estimatedTime: z.number().int().positive().default(15),
});

export async function createRoutine(data: z.infer<typeof CreateRoutineSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user's organization
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    if (!membership) {
      return { success: false, error: 'No household found' };
    }

    // Validate input
    const validated = CreateRoutineSchema.parse(data);

    // Create routine
    const routine = await prisma.routine.create({
      data: {
        ...validated,
        organizationId: membership.organizationId,
      },
    });

    revalidatePath('/routines');
    return { success: true, data: routine };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    console.error('Error creating routine:', error);
    return { success: false, error: 'Failed to create routine' };
  }
}

export async function deleteRoutine(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user's organization
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    if (!membership) {
      return { success: false, error: 'No household found' };
    }

    // Verify routine belongs to user's organization
    const routine = await prisma.routine.findFirst({
      where: {
        id,
        organizationId: membership.organizationId,
      },
    });

    if (!routine) {
      return { success: false, error: 'Routine not found or access denied' };
    }

    // Delete routine
    await prisma.routine.delete({
      where: { id },
    });

    revalidatePath('/routines');
    return { success: true };
  } catch (error) {
    console.error('Error deleting routine:', error);
    return { success: false, error: 'Failed to delete routine' };
  }
}

export async function drawLottery(energy: string, maxTime: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: 'Unauthorized', data: null };
    }

    // Get user's organization
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    if (!membership) {
      return { success: false, error: 'No household found', data: null };
    }

    // Validate energy level
    if (!['low', 'medium', 'high'].includes(energy)) {
      return { success: false, error: 'Invalid energy level', data: null };
    }

    // Fetch candidates matching criteria
    const candidates = await prisma.routine.findMany({
      where: {
        organizationId: membership.organizationId,
        energyLevel: energy,
        estimatedTime: { lte: maxTime },
      },
    });

    if (candidates.length === 0) {
      return { success: true, error: null, data: null }; // No candidates, but not an error
    }

    // Randomize selection
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];

    return { success: true, error: null, data: selected };
  } catch (error) {
    console.error('Error drawing lottery:', error);
    return { success: false, error: 'Failed to draw lottery', data: null };
  }
}

