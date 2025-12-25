import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getGroceryList } from '@/actions/grocery-actions';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CheckSquare, Calendar, Printer } from 'lucide-react';

export default async function GroceriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');

  const params = await searchParams;
  const dateParam =
    typeof params.week === 'string' ? params.week : new Date().toISOString();
  const date = new Date(dateParam);

  // Get User's Organization
  const membership = await prisma.member.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  if (!membership) {
    return <div>No household assigned.</div>;
  }

  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  const result = await getGroceryList(membership.organizationId, start, end);
  const items = result.data || [];

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            Grocery List
          </h1>
          <p className="mt-1 text-gray-500">
            Plan for {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No items needed
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Add recipes to your Meal Planner to generate a list.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li
                key={`${item.name}-${item.unit}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Used in: {item.recipes.map((r) => r.recipeName).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                    {Math.round(item.totalQuantity * 100) / 100} {item.unit}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


