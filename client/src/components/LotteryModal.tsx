import React, { useState } from 'react';
import { Routine, LotteryRequest } from '../types';
import RoutineCard from './RoutineCard';

interface LotteryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLottery: (request: LotteryRequest) => void;
  selectedRoutines: Routine[];
}

const LotteryModal: React.FC<LotteryModalProps> = ({
  isOpen,
  onClose,
  onLottery,
  selectedRoutines
}) => {
  const [lotteryRequest, setLotteryRequest] = useState<LotteryRequest>({
    count: 1,
    context: '',
    energy: '',
    duration: '',
    difficulty: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLottery(lotteryRequest);
  };

  const handleInputChange = (field: keyof LotteryRequest, value: string | number) => {
    setLotteryRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🎲 Routine Lottery</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {selectedRoutines.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Random Routine{selectedRoutines.length > 1 ? 's' : ''}:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedRoutines.map((routine) => (
                  <RoutineCard
                    key={routine._id}
                    routine={routine}
                    showLottery={true}
                  />
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={() => onLottery(lotteryRequest)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Routines
                  </label>
                  <select
                    value={lotteryRequest.count}
                    onChange={(e) => handleInputChange('count', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={1}>1 Routine</option>
                    <option value={2}>2 Routines</option>
                    <option value={3}>3 Routines</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time of Day (Optional)
                    </label>
                    <select
                      value={lotteryRequest.context}
                      onChange={(e) => handleInputChange('context', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Any Time</option>
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Level (Optional)
                    </label>
                    <select
                      value={lotteryRequest.energy}
                      onChange={(e) => handleInputChange('energy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Any Energy</option>
                      <option value="low">Low Energy</option>
                      <option value="medium">Medium Energy</option>
                      <option value="high">High Energy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Optional)
                    </label>
                    <select
                      value={lotteryRequest.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Any Duration</option>
                      <option value="5min">5 minutes</option>
                      <option value="15min">15 minutes</option>
                      <option value="30min">30 minutes</option>
                      <option value="60min">60 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty (Optional)
                    </label>
                    <select
                      value={lotteryRequest.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Any Difficulty</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  🎲 Get Random Routine{(lotteryRequest.count || 1) > 1 ? 's' : ''}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryModal;
