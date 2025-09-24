import React from 'react';
import { EducationalResource } from '../types';

interface EducationalResourceDetailProps {
  resource: EducationalResource;
  onClose: () => void;
  onLike: () => void;
}

const EducationalResourceDetail: React.FC<EducationalResourceDetailProps> = ({
  resource,
  onClose,
  onLike
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getCategoryIcon(resource.category)}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{resource.title}</h1>
                <p className="text-sm text-gray-600">by {resource.author}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{resource.likeCount}</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
              >
                &times;
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {resource.readTime} min read
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {resource.viewCount} views
            </div>
            <div>{formatDate(resource.createdAt)}</div>
          </div>

          {/* Tags and Difficulty */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(resource.difficulty)}`}>
              {resource.difficulty}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {resource.category.replace('-', ' ')}
            </span>
            {resource.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {tag}
              </span>
            ))}
          </div>

          {/* Image */}
          {resource.imageUrl && (
            <div className="mb-6">
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-64 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Video */}
          {resource.videoUrl && (
            <div className="mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={resource.videoUrl}
                  title={resource.title}
                  className="w-full h-64 rounded-lg shadow-sm"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
          </div>

          {/* External Link */}
          {resource.isExternal && resource.externalUrl && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">External Resource</h3>
              <p className="text-blue-700 mb-3">
                This article is hosted externally. Click the link below to read the full content.
              </p>
              <a
                href={resource.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Full Article
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onLike}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Like ({resource.likeCount})</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalResourceDetail;
