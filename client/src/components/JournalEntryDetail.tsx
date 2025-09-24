import React from 'react';
import { JournalEntry } from '../types';

interface JournalEntryDetailProps {
  entry: JournalEntry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const JournalEntryDetail: React.FC<JournalEntryDetailProps> = ({
  entry,
  onClose,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingEmoji = (rating: number) => {
    if (rating >= 8) return '😊';
    if (rating >= 6) return '🙂';
    if (rating >= 4) return '😐';
    return '😔';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Journal Entry - {formatDate(entry.date)}
            </h2>
            <p className="text-sm text-gray-600">
              Created {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Mood & Energy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">😊</span>
                Mood
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className={`text-lg font-semibold ${getRatingColor(entry.mood.rating)}`}>
                    {getRatingEmoji(entry.mood.rating)} {entry.mood.rating}/10
                  </span>
                </div>
                {entry.mood.emotions.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Emotions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.mood.emotions.map((emotion, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.mood.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Notes:</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.mood.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                Energy
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className={`text-lg font-semibold ${getRatingColor(entry.energy.rating)}`}>
                    ⚡ {entry.energy.rating}/10
                  </span>
                </div>
                {entry.energy.factors.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Factors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.energy.factors.map((factor, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.energy.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Notes:</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.energy.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">😴</span>
              Sleep
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Hours Slept</span>
                <p className="text-lg font-semibold text-blue-600">{entry.sleep.hours}h</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quality</span>
                <p className={`text-lg font-semibold ${getRatingColor(entry.sleep.quality)}`}>
                  {entry.sleep.quality}/10
                </p>
              </div>
              {entry.sleep.notes && (
                <div className="md:col-span-1">
                  <span className="text-sm text-gray-600">Notes</span>
                  <p className="text-sm text-gray-800 mt-1">{entry.sleep.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Exercise */}
          {entry.exercise.duration > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🏃</span>
                Exercise
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Duration</span>
                  <p className="text-lg font-semibold text-orange-600">{entry.exercise.duration}m</p>
                </div>
                {entry.exercise.type && (
                  <div>
                    <span className="text-sm text-gray-600">Type</span>
                    <p className="text-lg font-semibold text-gray-900">{entry.exercise.type}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Intensity</span>
                  <p className={`text-lg font-semibold ${getRatingColor(entry.exercise.intensity)}`}>
                    {entry.exercise.intensity}/10
                  </p>
                </div>
                {entry.exercise.notes && (
                  <div className="md:col-span-3">
                    <span className="text-sm text-gray-600">Notes</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.exercise.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nutrition */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">🍎</span>
              Nutrition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Meals</span>
                <p className="text-lg font-semibold text-green-600">{entry.nutrition.meals}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Water (glasses)</span>
                <p className="text-lg font-semibold text-blue-600">{entry.nutrition.water}</p>
              </div>
              {entry.nutrition.notes && (
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-600">Notes</span>
                  <p className="text-sm text-gray-800 mt-1">{entry.nutrition.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">😰</span>
              Stress
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stress Level</span>
                <span className={`text-lg font-semibold ${getRatingColor(entry.stress.rating)}`}>
                  {entry.stress.rating}/10
                </span>
              </div>
              {entry.stress.sources.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Sources:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.stress.sources.map((source, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {entry.stress.copingStrategies.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Coping Strategies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.stress.copingStrategies.map((strategy, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {strategy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {entry.stress.notes && (
                <div>
                  <span className="text-sm text-gray-600">Notes:</span>
                  <p className="text-sm text-gray-800 mt-1">{entry.stress.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Gratitude */}
          {entry.gratitude.entries.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🙏</span>
                Gratitude
              </h3>
              <div className="space-y-2">
                {entry.gratitude.entries.map((gratitude, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-sm text-gray-500 mt-1">{index + 1}.</span>
                    <p className="text-sm text-gray-800">{gratitude}</p>
                  </div>
                ))}
                {entry.gratitude.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Additional Notes:</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.gratitude.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Goals */}
          {(entry.goals.achieved.length > 0 || entry.goals.progress.length > 0) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Goals
              </h3>
              <div className="space-y-4">
                {entry.goals.achieved.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-green-700">Achieved:</span>
                    <div className="space-y-1 mt-1">
                      {entry.goals.achieved.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm text-gray-800">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {entry.goals.progress.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">In Progress:</span>
                    <div className="space-y-1 mt-1">
                      {entry.goals.progress.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-blue-600">→</span>
                          <span className="text-sm text-gray-800">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {entry.goals.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Notes:</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.goals.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Symptoms */}
          {(entry.symptoms.physical.length > 0 || entry.symptoms.mental.length > 0) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🏥</span>
                Symptoms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entry.symptoms.physical.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-red-700">Physical:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.symptoms.physical.map((symptom, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.symptoms.mental.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-purple-700">Mental:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.symptoms.mental.map((symptom, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.symptoms.notes && (
                  <div className="md:col-span-2">
                    <span className="text-sm text-gray-600">Notes:</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.symptoms.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEntryDetail;
