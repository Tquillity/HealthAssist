import React, { useState, useEffect } from 'react';
import { mealPlansAPI } from '../services/api';
import { MealPlan } from '../types';
import MealPlanCalendar from '../components/MealPlanCalendar';
import MealPlanForm from '../components/MealPlanForm';
import GroceryList from '../components/GroceryList';

const MealPlanner: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [groceryListData, setGroceryListData] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const response = await mealPlansAPI.getAll();
      setMealPlans(response.data);
      
      // Set the most recent meal plan as current
      if (response.data.length > 0) {
        setCurrentMealPlan(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchCurrentMealPlan = async () => {
  //   try {
  //     const response = await mealPlansAPI.getCurrent();
  //     setCurrentMealPlan(response.data);
  //   } catch (error) {
  //     console.error('Error fetching current meal plan:', error);
  //   }
  // };

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const handleGenerateMealPlan = async (preferences: any) => {
    try {
      setFormLoading(true);
      const response = await mealPlansAPI.generate(preferences);
      setCurrentMealPlan(response.data);
      setShowForm(false);
      await fetchMealPlans();
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleGenerateGroceryList = async (mealPlan: MealPlan) => {
    try {
      const response = await mealPlansAPI.getGroceryList(mealPlan._id);
      setGroceryListData(response.data);
      setShowGroceryList(true);
    } catch (error) {
      console.error('Error generating grocery list:', error);
      alert('Failed to generate grocery list. Please try again.');
    }
  };

  const handlePrintGroceryList = () => {
    window.print();
  };

  const handleExportGroceryList = () => {
    if (!groceryListData) return;
    
    const csvContent = [
      ['Item', 'Quantity', 'Unit', 'Notes'],
      ...groceryListData.groceryList.map((item: any) => [
        item.name,
        item.quantity,
        item.unit,
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grocery-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleCloseGroceryList = () => {
    setShowGroceryList(false);
    setGroceryListData(null);
  };

  if (showForm) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Meal Plan</h1>
          <p className="text-gray-600">
            Create a personalized weekly meal plan based on your preferences
          </p>
        </div>
        <MealPlanForm
          onSubmit={handleGenerateMealPlan}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </div>
    );
  }

  if (showGroceryList && groceryListData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Grocery List</h1>
              <p className="text-gray-600">
                Shopping list for your weekly meal plan
              </p>
            </div>
            <button
              onClick={handleCloseGroceryList}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Meal Plan
            </button>
          </div>
        </div>
        <GroceryList
          items={groceryListData.groceryList}
          mealPlan={groceryListData.mealPlan}
          onPrint={handlePrintGroceryList}
          onExport={handleExportGroceryList}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Planner</h1>
            <p className="text-gray-600">
              Plan your weekly meals and generate shopping lists
            </p>
          </div>
          <div className="flex space-x-3">
            {currentMealPlan && (
              <button
                onClick={() => handleGenerateGroceryList(currentMealPlan)}
                className="bg-wellness-600 text-white px-4 py-2 rounded-lg hover:bg-wellness-700 transition-colors"
              >
                Generate Grocery List
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {currentMealPlan ? 'Generate New Plan' : 'Generate Meal Plan'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meal plans...</p>
        </div>
      ) : currentMealPlan ? (
        <div className="space-y-6">
          {/* Current Meal Plan */}
          <MealPlanCalendar
            mealPlan={currentMealPlan}
            showActions={true}
          />

          {/* Meal Plan History */}
          {mealPlans.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Meal Plans</h3>
              <div className="space-y-3">
                {mealPlans.slice(1).map((mealPlan) => (
                  <div key={mealPlan._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {mealPlan.meals.length} meals planned
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentMealPlan(mealPlan)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleGenerateGroceryList(mealPlan)}
                        className="text-wellness-600 hover:text-wellness-700 text-sm font-medium"
                      >
                        Grocery List
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Meal Plans Yet</h2>
          <p className="text-gray-600 mb-6">
            Generate your first meal plan to get started with automated meal planning.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Generate Your First Meal Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
