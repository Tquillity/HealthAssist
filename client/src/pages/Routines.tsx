import React, { useState, useEffect, useCallback } from 'react';
import { routinesAPI } from '../services/api';
import { Routine, RoutineFilters, LotteryRequest } from '../types';
import { useAuth } from '../hooks/useAuth';
import RoutineCard from '../components/RoutineCard';
import RoutineFiltersComponent from '../components/RoutineFilters';
import LotteryModal from '../components/LotteryModal';
import RoutineForm from '../components/RoutineForm';

const Routines: React.FC = () => {
  const { state } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RoutineFilters>({});
  const [showLotteryModal, setShowLotteryModal] = useState(false);
  const [selectedRoutines, setSelectedRoutines] = useState<Routine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const isAdmin = state.user?.role === 'admin';

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const response = await routinesAPI.getAll();
      setRoutines(response.data);
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...routines];

    if (filters.category) {
      filtered = filtered.filter(
        (routine) => routine.category === filters.category
      );
    }
    if (filters.context) {
      filtered = filtered.filter(
        (routine) => routine.metadata.context === filters.context
      );
    }
    if (filters.energy) {
      filtered = filtered.filter(
        (routine) => routine.metadata.energy === filters.energy
      );
    }
    if (filters.duration) {
      filtered = filtered.filter(
        (routine) => routine.metadata.duration === filters.duration
      );
    }
    if (filters.difficulty) {
      filtered = filtered.filter(
        (routine) => routine.metadata.difficulty === filters.difficulty
      );
    }

    setFilteredRoutines(filtered);
  }, [routines, filters]);

  useEffect(() => {
    fetchRoutines();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleLottery = async (lotteryRequest: LotteryRequest) => {
    try {
      const response = await routinesAPI.lottery(lotteryRequest);
      setSelectedRoutines(response.data.routines);
      setShowLotteryModal(true);
    } catch (error) {
      console.error('Error running lottery:', error);
    }
  };

  const handleFilterChange = (newFilters: RoutineFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleCreateRoutine = () => {
    setEditingRoutine(null);
    setShowForm(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setShowForm(true);
  };

  const handleDeleteRoutine = async (routine: Routine) => {
    if (
      !window.confirm(`Are you sure you want to delete "${routine.title}"?`)
    ) {
      return;
    }

    try {
      await routinesAPI.delete(routine._id);
      await fetchRoutines();
    } catch (error) {
      console.error('Error deleting routine:', error);
      alert('Failed to delete routine. Please try again.');
    }
  };

  const handleFormSubmit = async (routineData: Partial<Routine>) => {
    try {
      setFormLoading(true);

      if (editingRoutine) {
        await routinesAPI.update(editingRoutine._id, routineData);
      } else {
        await routinesAPI.create(routineData);
      }

      setShowForm(false);
      setEditingRoutine(null);
      await fetchRoutines();
    } catch (error) {
      console.error('Error saving routine:', error);
      alert('Failed to save routine. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoutine(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Wellness Routines
            </h1>
            <p className="text-gray-600">
              Discover and practice routines for better health and wellness
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleCreateRoutine}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Add Routine
            </button>
          )}
        </div>
      </div>

      {/* Lottery Section */}
      <div className="bg-gradient-to-r from-primary-500 to-wellness-500 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎲 Routine Lottery</h2>
            <p className="text-primary-100">
              Let us surprise you with a random routine tailored to your
              preferences
            </p>
          </div>
          <button
            onClick={() => setShowLotteryModal(true)}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Try Lottery
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <RoutineFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {filteredRoutines.length} routine
          {filteredRoutines.length !== 1 ? 's' : ''} found
        </p>
        <button
          onClick={() => handleLottery({ count: 1, filters })}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Random Routine
        </button>
      </div>

      {/* Routines Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredRoutines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine) => (
            <RoutineCard
              key={routine._id}
              routine={routine}
              onClick={() => {
                // Handle routine selection/viewing
                console.log('Selected routine:', routine.title);
              }}
              onEdit={isAdmin ? () => handleEditRoutine(routine) : undefined}
              onDelete={
                isAdmin ? () => handleDeleteRoutine(routine) : undefined
              }
              showAdminControls={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No routines found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or clear them to see all available
            routines.
          </p>
          <button
            onClick={clearFilters}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Lottery Modal */}
      {showLotteryModal && (
        <LotteryModal
          isOpen={showLotteryModal}
          onClose={() => setShowLotteryModal(false)}
          onLottery={handleLottery}
          selectedRoutines={selectedRoutines}
        />
      )}

      {/* Routine Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRoutine ? 'Edit Routine' : 'Create New Routine'}
                </h2>
                <button
                  onClick={handleFormCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <RoutineForm
                routine={editingRoutine || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routines;
