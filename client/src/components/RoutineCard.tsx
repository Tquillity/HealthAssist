import React from 'react';
import { Routine } from '../types';

interface RoutineCardProps {
  routine: Routine;
  onClick?: () => void;
  showLottery?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showAdminControls?: boolean;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ 
  routine, 
  onClick, 
  showLottery = false, 
  onEdit, 
  onDelete, 
  showAdminControls = false 
}) => {
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      breathwork: '🌬️',
      meditation: '🧘',
      exercise: '💪',
      stretching: '🤸',
      mindfulness: '🧠',
      sleep: '😴',
      energy: '⚡'
    };
    return icons[category] || '🌟';
  };

  const getContextColor = (context: string) => {
    const colors: { [key: string]: string } = {
      morning: 'bg-yellow-100 text-yellow-800',
      evening: 'bg-purple-100 text-purple-800',
      anytime: 'bg-blue-100 text-blue-800'
    };
    return colors[context] || 'bg-gray-100 text-gray-800';
  };

  const getEnergyColor = (energy: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[energy] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={routine.imageUrl}
          alt={routine.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="text-2xl">
            {getCategoryIcon(routine.category)}
          </span>
        </div>
        {showLottery && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              🎲 LOTTERY
            </span>
          </div>
        )}
        {showAdminControls && (
          <div className="absolute top-3 right-3 flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
                title="Edit routine"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                title="Delete routine"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {routine.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {routine.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContextColor(routine.metadata.context)}`}>
            {routine.metadata.context}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnergyColor(routine.metadata.energy)}`}>
            {routine.metadata.energy} energy
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {routine.metadata.duration}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">Difficulty:</span>
            <span className="font-medium capitalize">{routine.metadata.difficulty}</span>
          </div>
          
          {routine.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {routine.metadata.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {routine.metadata.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{routine.metadata.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
