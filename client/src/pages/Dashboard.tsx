import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { routinesAPI, recipesAPI } from '../services/api';
import { Routine } from '../types';
import RoutineCard from '../components/RoutineCard';

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const [recentRoutines, setRecentRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [routinesCount, setRoutinesCount] = useState(0);
  const [recipesCount, setRecipesCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only fetch data if user is authenticated
      if (!state.isAuthenticated || !state.user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch recent routines
        const routinesResponse = await routinesAPI.getAll({ limit: 6 });
        console.log('Routines response:', routinesResponse);
        setRecentRoutines(routinesResponse.data);

        // Fetch total routines count
        const allRoutinesResponse = await routinesAPI.getAll();
        console.log('All routines response:', allRoutinesResponse);
        setRoutinesCount(allRoutinesResponse.data.length);

        // Fetch total recipes count
        const recipesResponse = await recipesAPI.getAll();
        console.log('Recipes response:', recipesResponse);
        setRecipesCount(recipesResponse.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [state.isAuthenticated, state.user]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {state.user?.profile.firstName}!
        </h1>
        <p className="text-gray-600">
          Ready to take care of your health and wellness today?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/routines"
                className="block w-full bg-primary-600 text-white text-center py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                🎲 Try Routine Lottery
              </Link>
              <Link
                to="/meal-planner"
                className="block w-full bg-wellness-600 text-white text-center py-3 px-4 rounded-lg hover:bg-wellness-700 transition-colors"
              >
                🍽️ Plan Meals
              </Link>
              <Link
                to="/recipes"
                className="block w-full bg-gray-600 text-white text-center py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                📖 Browse Recipes
              </Link>
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-br from-primary-50 to-wellness-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Today's Tip
            </h3>
            <p className="text-gray-700 text-sm">
              "Starting your day with 5 minutes of deep breathing can
              significantly improve your energy levels and mental clarity
              throughout the day."
            </p>
          </div>
        </div>

        {/* Recent Routines */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Featured Routines
              </h2>
              <Link
                to="/routines"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentRoutines.slice(0, 4).map((routine) => (
                  <RoutineCard key={routine._id} routine={routine} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <span className="text-2xl">🧘</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Routines Available
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {routinesCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-wellness-100 rounded-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Recipes in Database
              </p>
              <p className="text-2xl font-bold text-gray-900">{recipesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Meal Plans</p>
              <p className="text-2xl font-bold text-gray-900">Weekly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
