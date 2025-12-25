import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { JournalClient } from '@/components/journal/journal-client';
import { Calendar, Plus } from 'lucide-react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export default async function JournalPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  // Get current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Fetch journal entries for current month
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });

  // Create a map of date -> entry for quick lookup
  const entryMap = new Map(
    entries.map((e) => [e.date.toISOString().split('T')[0], e])
  );

  // Generate calendar days
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
          <p className="mt-1 text-gray-500">
            Track your mood, energy, and sleep patterns.
          </p>
        </div>
        <JournalClient />
      </div>

      {/* Calendar Heatmap */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(now, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-gray-100"></div>
              <span>No entry</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-red-200"></div>
              <span>Low mood (1-3)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-yellow-200"></div>
              <span>Medium (4-7)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-green-200"></div>
              <span>High (8-10)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const entry = entryMap.get(dayKey);
            const mood = entry?.mood;

            // Determine color based on mood
            let bgColor = 'bg-gray-100'; // No entry
            if (mood !== null && mood !== undefined) {
              if (mood <= 3) bgColor = 'bg-red-200';
              else if (mood <= 7) bgColor = 'bg-yellow-200';
              else bgColor = 'bg-green-200';
            }

            const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

            return (
              <div
                key={dayKey}
                className={`flex h-12 items-center justify-center rounded-lg border-2 text-sm font-medium transition-colors ${
                  isToday ? 'border-blue-500' : 'border-transparent'
                } ${bgColor} ${entry ? 'cursor-pointer hover:opacity-80' : ''}`}
                title={
                  entry
                    ? `Mood: ${entry.mood}/10, Energy: ${entry.energy}/10`
                    : 'No entry'
                }
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Entries</h2>
          <div className="space-y-4">
            {entries
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 5)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-900">
                        {format(entry.date, 'MMM d, yyyy')}
                      </p>
                      {entry.mood !== null && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Mood: {entry.mood}/10
                        </span>
                      )}
                      {entry.energy !== null && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          Energy: {entry.energy}/10
                        </span>
                      )}
                      {entry.sleepHours !== null && (
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                          Sleep: {entry.sleepHours}h
                        </span>
                      )}
                    </div>
                    {entry.content && (
                      <p className="mt-2 text-sm text-gray-600">{entry.content}</p>
                    )}
                    {entry.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
