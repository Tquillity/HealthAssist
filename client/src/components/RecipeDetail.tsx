import React from 'react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  showActions?: boolean;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, 
  onEdit, 
  onDelete, 
  onClose,
  showActions = false 
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Recipe Image */}
        <div className="relative h-64 md:h-80 bg-gray-200">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
            }}
          />
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-sm"
              title="Close"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Recipe Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{recipe.description}</p>
              
              {/* Recipe Meta */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(recipe.metadata.prepTime + recipe.metadata.cookTime)} total
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {recipe.metadata.servings} serving{recipe.metadata.servings !== 1 ? 's' : ''}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.metadata.difficulty)}`}>
                  {recipe.metadata.difficulty}
                </span>
              </div>

              {/* Dietary Tags */}
              {recipe.metadata.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.metadata.dietaryTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex space-x-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium">{ingredient.name}</span>
                    {ingredient.notes && (
                      <p className="text-sm text-gray-500">{ingredient.notes}</p>
                    )}
                  </div>
                  <span className="text-gray-600 font-medium">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Information */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nutrition Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.calories}</div>
              <div className="text-sm text-gray-500">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.protein}g</div>
              <div className="text-sm text-gray-500">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.carbs}g</div>
              <div className="text-sm text-gray-500">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.fat}g</div>
              <div className="text-sm text-gray-500">Fat</div>
            </div>
          </div>
          
          {(recipe.nutrition.fiber > 0 || recipe.nutrition.sugar > 0 || recipe.nutrition.sodium > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                {recipe.nutrition.fiber > 0 && (
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{recipe.nutrition.fiber}g</div>
                    <div className="text-sm text-gray-500">Fiber</div>
                  </div>
                )}
                {recipe.nutrition.sugar > 0 && (
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{recipe.nutrition.sugar}g</div>
                    <div className="text-sm text-gray-500">Sugar</div>
                  </div>
                )}
                {recipe.nutrition.sodium > 0 && (
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{recipe.nutrition.sodium}mg</div>
                    <div className="text-sm text-gray-500">Sodium</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Per {recipe.nutrition.perServing ? 'serving' : 'recipe'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
