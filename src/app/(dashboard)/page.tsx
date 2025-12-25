import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  // Fetch household details from DB (session may not include active org yet)
  const membership = await prisma.member.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  const householdName = membership?.organization.name || 'No Household';
  const householdId = membership?.organization.id || 'Unassigned';

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Dashboard Overview
      </h1>
      <p className="mt-2 text-gray-500">
        Manage your household wellness and meals.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Active User
          </h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {session.user.name}
          </p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>

        {/* Household Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Household
          </h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">{householdName}</p>
          <p className="mt-1 inline-block rounded bg-blue-50 px-2 py-1 font-mono text-xs text-blue-600">
            ID: {householdId}
          </p>
        </div>
      </div>
    </div>
  );
}
