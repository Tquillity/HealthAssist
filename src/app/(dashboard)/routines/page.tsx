import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { RoutinesClient } from '@/components/routines/routines-client';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function RoutinesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  // Get user's organization
  const membership = await prisma.member.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  if (!membership) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No household assigned.</p>
      </div>
    );
  }

  // Fetch routines for this organization
  const routines = await prisma.routine.findMany({
    where: {
      OR: [
        { organizationId: membership.organizationId },
        { isSystem: true },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Routines</h1>
          <p className="mt-1 text-gray-500">
            Manage your habits and use the lottery to pick what to do next.
          </p>
        </div>
        <div className="flex gap-2">
          <RoutinesClient routines={routines} />
        </div>
      </div>

      {routines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No routines yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first routine to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{routine.name}</h3>
                  {routine.description && (
                    <p className="mt-1 text-sm text-gray-500">{routine.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {routine.category && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {routine.category}
                  </span>
                )}
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
                  {routine.energyLevel} energy
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {routine.estimatedTime} min
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

