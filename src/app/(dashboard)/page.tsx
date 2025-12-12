import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  // Get active organization (household) if available
  // Better-Auth organization plugin provides this through the session
  // The organization ID might be in session.user or session.organization
  type SessionWithOrg = typeof session & {
    organization?: { id: string };
    user?: { organizationId?: string };
  };
  const sessionWithOrg = session as SessionWithOrg;
  const activeOrganizationId =
    sessionWithOrg.organization?.id ||
    sessionWithOrg.user?.organizationId ||
    'No household assigned';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <p className="text-lg text-gray-700">
            Welcome back,{' '}
            <span className="font-semibold">{session.user.name}</span>
          </p>
          <p className="mt-4 text-gray-600">
            Household ID:{' '}
            <span className="font-mono text-sm">{activeOrganizationId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
