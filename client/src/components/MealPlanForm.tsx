import React, { useState, useEffect } from 'react';
import { recipesAPI } from '../services/api';
import { Recipe } from '../types';

interface MealPlanFormProps {
  onSubmit: (preferences: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const MealPlanForm: React.FC<MealPlanFormProps> = ({ onSubmit, onCancel, loading = false }) => {
  const [preferences, setPreferences] = useState({
    weekStartDate: new Date().toISOString().split('T')[0],
    dietaryRestrictions: [] as string[],
    healthGoals: [] as string[],
    cuisinePreferences: [] as string[],
    avoidIngredients: [] as string[]
  });

  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 
    'low-carb', 'high-protein', 'low-sodium', 'nut-free'
  ];

  const healthGoalOptions = [
    'weight-loss', 'muscle-gain', 'heart-healthy', 'diabetes-friendly', 
    'anti-inflammatory', 'energy-boost', 'digestive-health'
  ];

  const cuisineOptions = [
    'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 
    'French', 'Thai', 'Chinese', 'Japanese', 'Middle Eastern'
  ];

  const commonIngredients = [
    'nuts', 'dairy', 'gluten', 'soy', 'eggs', 'shellfish', 'fish', 
    'pork', 'beef', 'chicken', 'onions', 'garlic', 'spicy'
  ];

  useEffect(() => {
    fetchAvailableRecipes();
  }, []);

  const fetchAvailableRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const response = await recipesAPI.getAll();
      setAvailableRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handlePreferenceChange = (category: string, value: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev] as string[], value]
        : (prev[category as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(preferences);
  };

  const getAvailableRecipeCount = () => {
    if (availableRecipes.length === 0) return 0;
    
    let filtered = availableRecipes;
    
    if (preferences.dietaryRestrictions.length > 0) {
      filtered = filtered.filter(recipe => 
        preferences.dietaryRestrictions.some(restriction => 
          recipe.metadata.dietaryTags.includes(restriction)
        )
      );
    }
    
    return filtered.length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Plan Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Week Start Date
              </label>
              <input
                type="date"
                value={preferences.weekStartDate}
                onChange={(e) => setPreferences({ ...preferences, weekStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Recipes
              </label>
              <div className="text-sm text-gray-600">
                {loadingRecipes ? (
                  <span>Loading recipes...</span>
                ) : (
                  <span>
                    {getAvailableRecipeCount()} recipes available
                    {getAvailableRecipeCount() === 0 && (
                      <span className="text-red-600 ml-2">(Add recipes first)</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h3>
          <p className="text-sm text-gray-600 mb-4">Select any dietary restrictions to consider when planning meals.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryOptions.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.dietaryRestrictions.includes(option)}
                  onChange={(e) => handlePreferenceChange('dietaryRestrictions', option, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {option.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Goals</h3>
          <p className="text-sm text-gray-600 mb-4">Select your health goals to help choose appropriate recipes.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {healthGoalOptions.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.healthGoals.includes(option)}
                  onChange={(e) => handlePreferenceChange('healthGoals', option, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {option.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cuisine Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuisine Preferences</h3>
          <p className="text-sm text-gray-600 mb-4">Select your preferred cuisines for meal variety.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cuisineOptions.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.cuisinePreferences.includes(option)}
                  onChange={(e) => handlePreferenceChange('cuisinePreferences', option, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Avoid Ingredients */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Avoid Ingredients</h3>
          <p className="text-sm text-gray-600 mb-4">Select ingredients you'd like to avoid in your meal plan.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonIngredients.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.avoidIngredients.includes(option)}
                  onChange={(e) => handlePreferenceChange('avoidIngredients', option, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Meal Plan Summary</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Week:</strong> {new Date(preferences.weekStartDate).toLocaleDateString()} - {new Date(new Date(preferences.weekStartDate).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p><strong>Dietary Restrictions:</strong> {preferences.dietaryRestrictions.length > 0 ? preferences.dietaryRestrictions.join(', ') : 'None'}</p>
            <p><strong>Health Goals:</strong> {preferences.healthGoals.length > 0 ? preferences.healthGoals.join(', ') : 'None'}</p>
            <p><strong>Cuisine Preferences:</strong> {preferences.cuisinePreferences.length > 0 ? preferences.cuisinePreferences.join(', ') : 'Any'}</p>
            <p><strong>Available Recipes:</strong> {getAvailableRecipeCount()}</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || getAvailableRecipeCount() === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Meal Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MealPlanForm;
