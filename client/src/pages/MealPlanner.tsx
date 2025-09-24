import React from 'react';

const MealPlanner: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Planner</h1>
        <p className="text-gray-600">
          Plan your weekly meals and generate shopping lists
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meal Planning Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This feature will help you plan your weekly meals and generate shopping lists automatically.
        </p>
        <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Planned Features:</h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• Automated weekly meal plan generation based on your preferences</li>
            <li>• Dietary restriction and health goal consideration</li>
            <li>• Integration with your recipe database</li>
            <li>• Automatic grocery list generation</li>
            <li>• Household meal planning with shared access</li>
            <li>• Nutrition tracking and analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
