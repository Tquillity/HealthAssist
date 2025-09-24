import React, { useState, useEffect } from 'react';
import { educationalAPI } from '../services/api';
import { EducationalResourceFilters } from '../types';

interface EducationalFiltersProps {
  filters: EducationalResourceFilters;
  onFilterChange: (filters: EducationalResourceFilters) => void;
}

const EducationalFilters: React.FC<EducationalFiltersProps> = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const response = await educationalAPI.getMetadata();
      setCategories(response.data.categories);
      setDifficulties(response.data.difficulties);
      setAllTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      onFilterChange({ ...filters, [name]: checked });
    } else {
      onFilterChange({ ...filters, [name]: value === '' ? undefined : value });
    }
  };

  const handleTagChange = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFilterChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'nutrition': '🥗',
      'exercise': '💪',
      'mental-health': '🧠',
      'sleep': '😴',
      'wellness': '✨',
      'meditation': '🧘',
      'stress-management': '🌿',
      'hormones': '🔄',
      'recipes': '👨‍🍳',
      'lifestyle': '🌟'
    };
    return icons[category] || '📚';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Featured Filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={filters.featured || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              ⭐ Featured only
            </span>
          </label>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty</label>
          <div className="space-y-2">
            {difficulties.map(difficulty => (
              <label key={difficulty} className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty}
                  checked={filters.difficulty === difficulty}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className={`ml-2 text-sm px-2 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 20).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.tags?.includes(tag)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {allTags.length > 20 && (
            <p className="text-xs text-gray-500 mt-2">
              Showing first 20 tags. Use search for more specific results.
            </p>
          )}
        </div>

        {/* Active Filters Summary */}
        {(filters.category || filters.difficulty || filters.tags?.length || filters.featured) && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getCategoryIcon(filters.category)} {filters.category.replace('-', ' ')}
                </span>
              )}
              {filters.difficulty && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(filters.difficulty)}`}>
                  {filters.difficulty}
                </span>
              )}
              {filters.tags?.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
              {filters.featured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalFilters;
