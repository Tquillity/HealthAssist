import React from 'react';

const Recipes: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Database</h1>
        <p className="text-gray-600">
          Discover and manage your healthy recipes
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recipe Database Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This feature will allow you to browse, add, and manage your favorite healthy recipes.
        </p>
        <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Planned Features:</h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• Browse and search recipes by category, dietary restrictions, and ingredients</li>
            <li>• Add your own recipes with detailed instructions and nutritional information</li>
            <li>• Share recipes with your household members</li>
            <li>• Integration with meal planning for automated weekly menus</li>
            <li>• Generate shopping lists from selected recipes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
