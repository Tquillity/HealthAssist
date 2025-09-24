import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

interface JournalFormProps {
  entry?: JournalEntry | null;
  date: string;
  onSave: (data: Partial<JournalEntry>) => Promise<void>;
  onUpdate: (data: Partial<JournalEntry>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const JournalForm: React.FC<JournalFormProps> = ({
  entry,
  date,
  onSave,
  onUpdate,
  onCancel,
  loading
}) => {
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    mood: {
      rating: 5,
      notes: '',
      emotions: []
    },
    energy: {
      rating: 5,
      notes: '',
      factors: []
    },
    sleep: {
      hours: 8,
      quality: 5,
      notes: ''
    },
    exercise: {
      duration: 0,
      type: '',
      intensity: 5,
      notes: ''
    },
    nutrition: {
      meals: 3,
      water: 8,
      notes: ''
    },
    stress: {
      rating: 5,
      sources: [],
      copingStrategies: [],
      notes: ''
    },
    gratitude: {
      entries: [''],
      notes: ''
    },
    goals: {
      achieved: [],
      progress: [],
      notes: ''
    },
    symptoms: {
      physical: [],
      mental: [],
      notes: ''
    },
    isPrivate: false,
    tags: []
  });

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    }
  }, [entry]);

  const handleChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any || {}),
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: string, field: string, value: string, add: boolean) => {
    const currentArray = (formData[section as keyof typeof formData] as any)?.[field] || [];
    const newArray = add 
      ? [...currentArray, value]
      : currentArray.filter((item: string) => item !== value);
    
    handleChange(section, field, newArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (entry) {
      await onUpdate(formData);
    } else {
      await onSave(formData);
    }
  };

  const emotionOptions = [
    'happy', 'sad', 'anxious', 'calm', 'excited', 'frustrated', 'grateful', 'worried',
    'content', 'overwhelmed', 'peaceful', 'angry', 'hopeful', 'lonely', 'confident'
  ];

  const energyFactors = [
    'sleep', 'exercise', 'nutrition', 'stress', 'weather', 'social', 'work', 'meditation'
  ];

  // const stressSources = [
  //   'work', 'relationships', 'health', 'finances', 'family', 'social', 'future', 'past'
  // ];

  // const copingStrategies = [
  //   'meditation', 'exercise', 'breathing', 'music', 'nature', 'social', 'journaling', 'therapy'
  // ];

  // const physicalSymptoms = [
  //   'headache', 'fatigue', 'muscle tension', 'stomach issues', 'sleep problems',
  //   'appetite changes', 'pain', 'dizziness', 'nausea', 'chest tightness'
  // ];

  // const mentalSymptoms = [
  //   'anxiety', 'depression', 'irritability', 'mood swings', 'concentration issues',
  //   'memory problems', 'racing thoughts', 'negative thoughts', 'panic', 'worry'
  // ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Mood Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood & Emotions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood Rating (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood?.rating || 5}
              onChange={(e) => handleChange('mood', 'rating', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 (Very Low)</span>
              <span className="text-lg font-semibold text-primary-600">
                {formData.mood?.rating || 5}
              </span>
              <span>10 (Very High)</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emotions
            </label>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map(emotion => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => handleArrayChange('mood', 'emotions', emotion, 
                    !formData.mood?.emotions?.includes(emotion))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.mood?.emotions?.includes(emotion)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood Notes
            </label>
            <textarea
              value={formData.mood?.notes || ''}
              onChange={(e) => handleChange('mood', 'notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="How are you feeling today? What's contributing to your mood?"
            />
          </div>
        </div>
      </div>

      {/* Energy Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Rating (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.energy?.rating || 5}
              onChange={(e) => handleChange('energy', 'rating', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 (Very Low)</span>
              <span className="text-lg font-semibold text-primary-600">
                {formData.energy?.rating || 5}
              </span>
              <span>10 (Very High)</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Factors
            </label>
            <div className="flex flex-wrap gap-2">
              {energyFactors.map(factor => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => handleArrayChange('energy', 'factors', factor,
                    !formData.energy?.factors?.includes(factor))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.energy?.factors?.includes(factor)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Notes
            </label>
            <textarea
              value={formData.energy?.notes || ''}
              onChange={(e) => handleChange('energy', 'notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="What's affecting your energy today?"
            />
          </div>
        </div>
      </div>

      {/* Sleep Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours Slept
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleep?.hours || 8}
              onChange={(e) => handleChange('sleep', 'hours', parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Quality (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.sleep?.quality || 5}
              onChange={(e) => handleChange('sleep', 'quality', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm font-semibold text-primary-600 mt-1">
              {formData.sleep?.quality || 5}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Notes
            </label>
            <textarea
              value={formData.sleep?.notes || ''}
              onChange={(e) => handleChange('sleep', 'notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="How did you sleep?"
            />
          </div>
        </div>
      </div>

      {/* Exercise Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={formData.exercise?.duration || 0}
              onChange={(e) => handleChange('exercise', 'duration', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Exercise
            </label>
            <input
              type="text"
              value={formData.exercise?.type || ''}
              onChange={(e) => handleChange('exercise', 'type', e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., running, yoga, weightlifting"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intensity (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.exercise?.intensity || 5}
              onChange={(e) => handleChange('exercise', 'intensity', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm font-semibold text-primary-600 mt-1">
              {formData.exercise?.intensity || 5}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Notes
            </label>
            <textarea
              value={formData.exercise?.notes || ''}
              onChange={(e) => handleChange('exercise', 'notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="How did your workout feel?"
            />
          </div>
        </div>
      </div>

      {/* Gratitude Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gratitude</h3>
        <div className="space-y-4">
          {formData.gratitude?.entries?.map((entry, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={entry}
                onChange={(e) => {
                  const newEntries = [...(formData.gratitude?.entries || [])];
                  newEntries[index] = e.target.value;
                  handleChange('gratitude', 'entries', newEntries);
                }}
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={`Gratitude ${index + 1}`}
              />
              {(formData.gratitude?.entries?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newEntries = formData.gratitude?.entries?.filter((_, i) => i !== index) || [];
                    handleChange('gratitude', 'entries', newEntries);
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newEntries = [...(formData.gratitude?.entries || []), ''];
              handleChange('gratitude', 'entries', newEntries);
            }}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            + Add Gratitude Entry
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {loading ? 'Saving...' : (entry ? 'Update Entry' : 'Save Entry')}
        </button>
      </div>
    </form>
  );
};

export default JournalForm;
