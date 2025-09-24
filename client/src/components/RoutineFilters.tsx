import React, { useState, useEffect } from 'react';
import { RoutineFilters } from '../types';
import { routinesAPI } from '../services/api';

interface RoutineFiltersProps {
  filters: RoutineFilters;
  onFilterChange: (filters: RoutineFilters) => void;
  onClearFilters: () => void;
}

const RoutineFiltersComponent: React.FC<RoutineFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [metadata, setMetadata] = useState({
    categories: [] as string[],
    contexts: [] as string[],
    energyLevels: [] as string[],
    durations: [] as string[],
    difficulties: [] as string[],
  });

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const response = await routinesAPI.getMetadata();
      setMetadata(response.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const handleFilterChange = (key: keyof RoutineFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === '') {
      delete newFilters[key];
    } else {
      // Handle tags as array, others as string
      if (key === 'tags') {
        newFilters[key] = [value];
      } else {
        (newFilters as any)[key] = value;
      }
    }
    onFilterChange(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Routines</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Categories</option>
            {metadata.categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Context Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time of Day
          </label>
          <select
            value={filters.context || ''}
            onChange={(e) => handleFilterChange('context', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any Time</option>
            {metadata.contexts.map((context) => (
              <option key={context} value={context}>
                {context.charAt(0).toUpperCase() + context.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Energy Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Energy Level
          </label>
          <select
            value={filters.energy || ''}
            onChange={(e) => handleFilterChange('energy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any Energy</option>
            {metadata.energyLevels.map((energy) => (
              <option key={energy} value={energy}>
                {energy.charAt(0).toUpperCase() + energy.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <select
            value={filters.duration || ''}
            onChange={(e) => handleFilterChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any Duration</option>
            {metadata.durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={filters.difficulty || ''}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any Difficulty</option>
            {metadata.difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
            >
              {key}: {value}
              <button
                onClick={() =>
                  handleFilterChange(key as keyof RoutineFilters, '')
                }
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutineFiltersComponent;
