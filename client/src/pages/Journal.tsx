import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import { JournalEntry, JournalAnalytics as AnalyticsType } from '../types';
import JournalForm from '../components/JournalForm';
import JournalCalendar from '../components/JournalCalendar';
import JournalAnalytics from '../components/JournalAnalytics';
import JournalEntryDetail from '../components/JournalEntryDetail';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'form' | 'analytics'>('calendar');

  useEffect(() => {
    fetchEntries();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchEntryByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.getAll({ limit: 30 });
      setEntries(response.data.entries);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntryByDate = async (date: string) => {
    try {
      const response = await journalAPI.getByDate(date);
      setSelectedEntry(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setSelectedEntry(null);
      } else {
        console.error('Error fetching journal entry:', error);
      }
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await journalAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setActiveTab('form');
  };

  const handleEntrySave = async (entryData: Partial<JournalEntry>) => {
    try {
      setLoading(true);
      const response = await journalAPI.create({
        ...entryData,
        date: selectedDate
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
    if (!selectedEntry) return;
    
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

  const handleEntryDelete = async (entryId: string) => {
    try {
      setLoading(true);
      await journalAPI.delete(entryId);
      
      setSelectedEntry(null);
      await fetchEntries();
      await fetchAnalytics();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedEntry(null);
    setActiveTab('form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wellness Journal</h1>
          <p className="text-gray-600">
            Track your mood, energy, sleep, and daily wellness metrics
          </p>
        </div>

        {/* Navigation Tabs */}
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Journal Calendar</h2>
              <button
                onClick={handleNewEntry}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                New Entry
              </button>
            </div>
            <JournalCalendar
              entries={entries}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onEntrySelect={setSelectedEntry}
            />
          </div>
        )}

        {activeTab === 'form' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
                </h2>
                <p className="text-gray-600">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-gray-500 hover:text-gray-700"
              >
                Back to Calendar
              </button>
            </div>
            <JournalForm
              entry={selectedEntry}
              date={selectedDate}
              onSave={handleEntrySave}
              onUpdate={handleEntryUpdate}
              onCancel={() => setActiveTab('calendar')}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Wellness Analytics</h2>
              <button
                onClick={fetchAnalytics}
                className="text-primary-600 hover:text-primary-700"
              >
                Refresh
              </button>
            </div>
            {analytics ? (
              <JournalAnalytics analytics={analytics} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No analytics data available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Entry Detail Modal */}
        {selectedEntry && activeTab === 'calendar' && (
          <JournalEntryDetail
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onEdit={() => setActiveTab('form')}
            onDelete={() => handleEntryDelete(selectedEntry._id)}
          />
        )}
      </div>
    </div>
  );
};

export default Journal;
