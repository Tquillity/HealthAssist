import React, { useState, useEffect, useCallback } from 'react';
import { journalAPI } from '../services/api';
import { JournalEntry, JournalAnalytics as AnalyticsType } from '../types';
import { useAuth } from '../hooks/useAuth';
import JournalForm from '../components/JournalForm';
import JournalCalendar from '../components/JournalCalendar';
import JournalAnalytics from '../components/JournalAnalytics';
import JournalEntryDetail from '../components/JournalEntryDetail';

const Journal: React.FC = () => {
  const { state } = useAuth();

  // Initialize with explicit types to avoid any type issues
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'form' | 'analytics'>(
    'calendar'
  );

  // Initialize selectedDate after component mounts
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        const { tab, date } = event.state;
        if (tab === 'form' && date) {
          setSelectedDate(date);
          setActiveTab('form');
        } else {
          setActiveTab('calendar');
          setSelectedEntry(null);
        }
      } else {
        // Default behavior - go back to calendar
        setActiveTab('calendar');
        setSelectedEntry(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.getAll({ limit: 30 });
      setEntries(response.data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntryByDate = useCallback(async (date: string) => {
    try {
      const response = await journalAPI.getByDate(date);
      setSelectedEntry(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setSelectedEntry(null);
      } else if (error.response?.status === 401) {
        console.log('User not authenticated, redirecting to login');
        setSelectedEntry(null);
      } else {
        console.error('Error fetching journal entry:', error);
        if (error.response?.status !== 404) {
          console.error(
            'Unexpected error fetching journal entry:',
            error.response?.data || error.message
          );
        }
      }
    }
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await journalAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    // Only fetch data if user is authenticated and not loading
    if (state.isAuthenticated && state.user && !state.loading) {
      fetchEntries();
      fetchAnalytics();
    }
  }, [state.isAuthenticated, state.user, state.loading]);

  useEffect(() => {
    // Only fetch entry if user is authenticated, not loading, and date is selected
    if (state.isAuthenticated && state.user && !state.loading && selectedDate) {
      fetchEntryByDate(selectedDate);
    }
  }, [
    selectedDate,
    state.isAuthenticated,
    state.user,
    state.loading,
    fetchEntryByDate,
  ]);

  // Handle conditional rendering AFTER all hooks are called
  if (!selectedDate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access your journal
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view and manage your journal entries.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setActiveTab('form');
    // Push state to browser history for back button support
    window.history.pushState(
      { tab: 'form', date },
      '',
      window.location.pathname
    );
  };

  const handleEntrySave = async (entryData: Partial<JournalEntry>) => {
    try {
      setLoading(true);
      const response = await journalAPI.create({
        ...entryData,
        date: selectedDate,
      });

      setSelectedEntry(response.data);
      await fetchEntries();
      await fetchAnalytics();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntryUpdate = async (entryData: Partial<JournalEntry>) => {
    if (!selectedEntry?._id) return;

    try {
      setLoading(true);
      const response = await journalAPI.update(selectedEntry._id, entryData);
      setSelectedEntry(response.data);
      await fetchEntries();
      await fetchAnalytics();
    } catch (error) {
      console.error('Error updating journal entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntryDelete = async () => {
    if (!selectedEntry?._id) return;

    try {
      setLoading(true);
      await journalAPI.delete(selectedEntry._id);
      setSelectedEntry(null);
      await fetchEntries();
      await fetchAnalytics();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal</h1>
          <p className="text-gray-600">Track your daily wellness journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'form'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {selectedEntry ? 'Edit Entry' : 'New Entry'}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'calendar' && (
          <JournalCalendar
            entries={entries}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEntrySelect={setSelectedEntry}
          />
        )}

        {activeTab === 'form' && (
          <div>
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  setSelectedEntry(null);
                  // Push state to browser history for back button support
                  window.history.pushState(null, '', window.location.pathname);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Calendar
              </button>
            </div>

            <JournalForm
              date={selectedDate}
              entry={selectedEntry}
              onSave={handleEntrySave}
              onUpdate={handleEntryUpdate}
              onCancel={() => {
                setActiveTab('calendar');
                setSelectedEntry(null);
                // Push state to browser history for back button support
                window.history.pushState(null, '', window.location.pathname);
              }}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
              <button
                onClick={fetchAnalytics}
                className="text-primary-600 hover:text-primary-700"
              >
                Refresh
              </button>
            </div>
            <JournalAnalytics analytics={analytics} />
          </div>
        )}

        {/* Entry Detail Modal */}
        {selectedEntry && activeTab === 'calendar' && (
          <JournalEntryDetail
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onEdit={() => setActiveTab('form')}
            onDelete={handleEntryDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Journal;
