'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRoutine, drawLottery } from '@/actions/routine-actions';
import { Plus, Sparkles, X } from 'lucide-react';
import type { Routine } from '@prisma/client';

interface RoutinesClientProps {
  routines: Routine[];
}

export function RoutinesClient({ routines: initialRoutines }: RoutinesClientProps) {
  const [routines, setRoutines] = useState(initialRoutines);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLotteryDialog, setShowLotteryDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lotteryResult, setLotteryResult] = useState<Routine | null>(null);
  const [lotterySpinning, setLotterySpinning] = useState(false);
  const [lotteryEnergy, setLotteryEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [lotteryMaxTime, setLotteryMaxTime] = useState(30);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    frequency: '',
    energyLevel: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: 15,
  });

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createRoutine(formData);

    if (result.success && result.data) {
      setRoutines([result.data, ...routines]);
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        frequency: '',
        energyLevel: 'medium',
        estimatedTime: 15,
      });
    } else {
      alert(result.error || 'Failed to create routine');
    }

    setIsSubmitting(false);
  };


  const handleDrawLottery = async () => {
    setLotterySpinning(true);
    setLotteryResult(null);

    // Simulate spinning animation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await drawLottery(lotteryEnergy, lotteryMaxTime);

    if (result.success && result.data) {
      setLotteryResult(result.data);
    } else if (result.success && !result.data) {
      alert('No routines match your criteria. Try adjusting energy level or time.');
    } else {
      alert(result.error || 'Failed to draw lottery');
    }

    setLotterySpinning(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowLotteryDialog(true)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Spin the Wheel
        </Button>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Routine
        </Button>
      </div>

      {/* Create Routine Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Routine</h2>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoutine} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., wellness"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <Input
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: e.target.value })
                    }
                    placeholder="e.g., daily"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Energy Level
                </label>
                <select
                  value={formData.energyLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      energyLevel: e.target.value as 'low' | 'medium' | 'high',
                    })
                  }
                  className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estimated Time (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedTime: parseInt(e.target.value) || 15,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lottery Dialog */}
      {showLotteryDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Todo Lottery</h2>
              <button
                onClick={() => {
                  setShowLotteryDialog(false);
                  setLotteryResult(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Energy Level
                </label>
                <select
                  value={lotteryEnergy}
                  onChange={(e) =>
                    setLotteryEnergy(e.target.value as 'low' | 'medium' | 'high')
                  }
                  className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Time Available (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={lotteryMaxTime}
                  onChange={(e) =>
                    setLotteryMaxTime(parseInt(e.target.value) || 30)
                  }
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleDrawLottery}
                disabled={lotterySpinning}
                className="w-full gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {lotterySpinning ? 'Spinning...' : 'Spin the Wheel'}
              </Button>

              {lotteryResult && (
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">Your pick:</p>
                  <p className="mt-1 text-lg font-bold text-blue-700">
                    {lotteryResult.name}
                  </p>
                  {lotteryResult.description && (
                    <p className="mt-1 text-sm text-blue-600">
                      {lotteryResult.description}
                    </p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {lotteryResult.estimatedTime} min
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

