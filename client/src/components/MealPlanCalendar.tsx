import React from 'react';
import { MealPlan, MealPlanItem } from '../types';

interface MealPlanCalendarProps {
  mealPlan: MealPlan;
  onMealClick?: (meal: MealPlanItem) => void;
  onEditMeal?: (meal: MealPlanItem) => void;
  onDeleteMeal?: (meal: MealPlanItem) => void;
  showActions?: boolean;
}

const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  mealPlan,
  onMealClick,
  onEditMeal,
  onDeleteMeal,
  showActions = false
}) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const getMealForDay = (dayIndex: number, mealType: string) => {
    const targetDate = new Date(mealPlan.weekStartDate);
    targetDate.setDate(targetDate.getDate() + dayIndex);
    
    return mealPlan.meals.find(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.toDateString() === targetDate.toDateString() && meal.mealType === mealType;
    });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-50 border-yellow-200';
      case 'lunch': return 'bg-orange-50 border-orange-200';
      case 'dinner': return 'bg-purple-50 border-purple-200';
      case 'snack': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Weekly Meal Plan</h2>
            <p className="text-sm text-gray-600">
              {formatDate(mealPlan.weekStartDate)} - {formatDate(mealPlan.weekEndDate)}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {mealPlan.meals.length} meals planned
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header Row */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              {daysOfWeek.map((day, index) => {
                const date = new Date(mealPlan.weekStartDate);
                date.setDate(date.getDate() + index);
                return (
                  <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div>{day}</div>
                    <div className="text-gray-400">{formatDate(date)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Meal Type Rows */}
          <tbody className="bg-white divide-y divide-gray-200">
            {mealTypes.map(mealType => (
              <tr key={mealType} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                  <div className="flex items-center">
                    <span className="mr-2">{getMealTypeIcon(mealType)}</span>
                    {mealType}
                  </div>
                </td>
                {daysOfWeek.map((_, dayIndex) => {
                  const meal = getMealForDay(dayIndex, mealType);
                  return (
                    <td key={`${mealType}-${dayIndex}`} className="px-4 py-3">
                      {meal ? (
                        <div 
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${getMealTypeColor(mealType)} ${
                            onMealClick ? 'hover:shadow-md' : ''
                          }`}
                          onClick={() => onMealClick?.(meal)}
                        >
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {meal.recipeName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                          </div>
                          {meal.notes && (
                            <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                              {meal.notes}
                            </div>
                          )}
                          {showActions && (
                            <div className="flex items-center justify-end mt-2 space-x-1">
                              {onEditMeal && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditMeal(meal);
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Edit meal"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              )}
                              {onDeleteMeal && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteMeal(meal);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                  title="Remove meal"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg border-2 border-dashed border-gray-200 text-center">
                          <div className="text-xs text-gray-400">
                            No {mealType}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Total meals:</span> {mealPlan.meals.length}
          </div>
          <div>
            <span className="font-medium">Unique recipes:</span> {new Set(mealPlan.meals.map(m => m.recipeId)).size}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanCalendar;
