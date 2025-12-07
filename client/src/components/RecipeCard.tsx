import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeanRoleColor = (role: string) => {
    switch (role) {
      case 'Infrastructure':
        return 'bg-gray-100 text-gray-800';
      case 'Process':
        return 'bg-blue-100 text-blue-800';
      case 'Daily':
        return 'bg-green-100 text-green-800';
      case 'Treat':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Recipe Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
          }}
        />
        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded-full shadow-sm"
                title="Edit recipe"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded-full shadow-sm"
                title="Delete recipe"
              >
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        {/* Recipe Name and Category */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {recipe.name}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {recipe.metadata.category}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {recipe.description}
        </p>

        {/* Recipe Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTime(recipe.metadata.prepTime + recipe.metadata.cookTime)}
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {recipe.metadata.servings} serving
              {recipe.metadata.servings !== 1 ? 's' : ''}
            </span>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.metadata.difficulty)}`}
          >
            {recipe.metadata.difficulty}
          </span>
          {recipe.leanInfo && (
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getLeanRoleColor(recipe.leanInfo.leanRole)}`}
            >
              {recipe.leanInfo.leanRole}
            </span>
          )}
        </div>

        {/* Nutrition Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{recipe.nutrition.calories} cal</span>
          <span>{recipe.nutrition.protein}g protein</span>
          <span>{recipe.nutrition.carbs}g carbs</span>
          <span>{recipe.nutrition.fat}g fat</span>
        </div>

        {/* Dietary Tags */}
        {recipe.metadata.dietaryTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {recipe.metadata.dietaryTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {recipe.metadata.dietaryTags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{recipe.metadata.dietaryTags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
