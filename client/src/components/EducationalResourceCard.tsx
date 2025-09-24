import React from 'react';
import { EducationalResource } from '../types';

interface EducationalResourceCardProps {
  resource: EducationalResource;
  onClick: (resource: EducationalResource) => void;
  onLike: () => void;
  showActions?: boolean;
  featured?: boolean;
}

const EducationalResourceCard: React.FC<EducationalResourceCardProps> = ({
  resource,
  onClick,
  onLike,
  showActions = true,
  featured = false
}) => {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'nutrition': '🥗',
      'exercise': '💪',
      'mental-health': '🧠',
      'sleep': '😴',
      'wellness': '✨',
      'meditation': '🧘',
      'stress-management': '🌿',
      'hormones': '🔄',
      'recipes': '👨‍🍳',
      'lifestyle': '🌟'
    };
    return icons[category] || '📚';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer ${
      featured ? 'ring-2 ring-primary-200' : ''
    }`}>
      {/* Image */}
      {resource.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-48 object-cover"
            onClick={() => onClick(resource)}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(resource.category)}</span>
            <div>
              <h3 
                className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                onClick={() => onClick(resource)}
              >
                {resource.title}
              </h3>
              <p className="text-sm text-gray-500">by {resource.author}</p>
            </div>
          </div>
          {featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resource.excerpt}
        </p>

        {/* Tags and Difficulty */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {resource.category.replace('-', ' ')}
          </span>
          {resource.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {resource.viewCount} views
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {resource.readTime} min read
            </span>
          </div>
          <span>{formatDate(resource.createdAt)}</span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{resource.likeCount}</span>
            </button>
            
            <button
              onClick={() => onClick(resource)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Read More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalResourceCard;
