import React from 'react';
import { JournalAnalytics as Analytics } from '../types';

interface JournalAnalyticsProps {
  analytics: Analytics;
}

const JournalAnalytics: React.FC<JournalAnalyticsProps> = ({ analytics }) => {
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mood Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Mood</p>
              <p className={`text-2xl font-bold ${getRatingColor(analytics.mood.average)}`}>
                {analytics.mood.average.toFixed(1)}
              </p>
            </div>
            <div className="text-3xl">😊</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className={getTrendColor(analytics.mood.trend)}>
                {getTrendIcon(analytics.mood.trend)} {Math.abs(analytics.mood.trend).toFixed(1)}
              </span>
              <span className="ml-2 text-gray-600">vs start</span>
            </div>
          </div>
        </div>

        {/* Energy Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Energy</p>
              <p className={`text-2xl font-bold ${getRatingColor(analytics.energy.average)}`}>
                {analytics.energy.average.toFixed(1)}
              </p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className={getTrendColor(analytics.energy.trend)}>
                {getTrendIcon(analytics.energy.trend)} {Math.abs(analytics.energy.trend).toFixed(1)}
              </span>
              <span className="ml-2 text-gray-600">vs start</span>
            </div>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Sleep</p>
              <p className="text-2xl font-bold text-blue-600">
                {analytics.sleep.averageHours.toFixed(1)}h
              </p>
            </div>
            <div className="text-3xl">😴</div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              Quality: {analytics.sleep.averageQuality.toFixed(1)}/10
            </div>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exercise</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(analytics.exercise.totalMinutes)}m
              </p>
            </div>
            <div className="text-3xl">🏃</div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              {analytics.exercise.daysActive} active days
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High (8-10)</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(analytics.mood.distribution.high / (analytics.mood.distribution.high + analytics.mood.distribution.medium + analytics.mood.distribution.low)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.mood.distribution.high}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medium (5-7)</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(analytics.mood.distribution.medium / (analytics.mood.distribution.high + analytics.mood.distribution.medium + analytics.mood.distribution.low)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.mood.distribution.medium}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low (1-4)</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(analytics.mood.distribution.low / (analytics.mood.distribution.high + analytics.mood.distribution.medium + analytics.mood.distribution.low)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.mood.distribution.low}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High (8-10)</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(analytics.energy.distribution.high / (analytics.energy.distribution.high + analytics.energy.distribution.medium + analytics.energy.distribution.low)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.energy.distribution.high}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medium (5-7)</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(analytics.energy.distribution.medium / (analytics.energy.distribution.high + analytics.energy.distribution.medium + analytics.energy.distribution.low)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.energy.distribution.medium}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low (1-4)</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(analytics.energy.distribution.low / (analytics.energy.distribution.high + analytics.energy.distribution.medium + analytics.energy.distribution.low)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.energy.distribution.low}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stress Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Stress Level</span>
              <span className={`text-lg font-semibold ${getRatingColor(analytics.stress.average)}`}>
                {analytics.stress.average.toFixed(1)}/10
              </span>
            </div>
            {Object.keys(analytics.stress.commonSources).length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Common Stress Sources</p>
                <div className="space-y-2">
                  {Object.entries(analytics.stress.commonSources)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{source}</span>
                        <span className="text-sm font-medium text-gray-900">{count} times</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gratitude Insights */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gratitude Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Gratitude Entries</span>
              <span className="text-lg font-semibold text-purple-600">
                {analytics.gratitude.totalEntries}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average per Day</span>
              <span className="text-lg font-semibold text-purple-600">
                {analytics.gratitude.averagePerDay.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(analytics.exercise.totalMinutes)}
            </div>
            <div className="text-sm text-gray-600">Total Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.exercise.averageIntensity.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average Intensity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.exercise.daysActive}
            </div>
            <div className="text-sm text-gray-600">Active Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalAnalytics;
