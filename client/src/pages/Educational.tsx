import React, { useState, useEffect } from 'react';
import { educationalAPI } from '../services/api';
import { EducationalResource, EducationalResourceFilters } from '../types';
import EducationalResourceCard from '../components/EducationalResourceCard';
import EducationalFilters from '../components/EducationalFilters';
import EducationalResourceDetail from '../components/EducationalResourceDetail';

const Educational: React.FC = () => {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<EducationalResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [filters, setFilters] = useState<EducationalResourceFilters>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResources();
    fetchFeaturedResources();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await educationalAPI.getAll({
        ...filters,
        search: searchTerm || undefined
      });
      setResources(response.data.resources);
    } catch (error) {
      console.error('Error fetching educational resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedResources = async () => {
    try {
      const response = await educationalAPI.getFeatured(6);
      setFeaturedResources(response.data);
    } catch (error) {
      console.error('Error fetching featured resources:', error);
    }
  };

  const handleFilterChange = (newFilters: EducationalResourceFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ ...filters, search: term });
  };

  const handleResourceSelect = async (resource: EducationalResource) => {
    try {
      const response = await educationalAPI.getById(resource._id);
      setSelectedResource(response.data);
    } catch (error) {
      console.error('Error fetching resource details:', error);
    }
  };

  const handleLike = async (resourceId: string) => {
    try {
      await educationalAPI.like(resourceId);
      // Update the resource in the list
      setResources(prev => prev.map(resource => 
        resource._id === resourceId 
          ? { ...resource, likeCount: resource.likeCount + 1 }
          : resource
      ));
      setFeaturedResources(prev => prev.map(resource => 
        resource._id === resourceId 
          ? { ...resource, likeCount: resource.likeCount + 1 }
          : resource
      ));
    } catch (error) {
      console.error('Error liking resource:', error);
    }
  };

  // const getCategoryIcon = (category: string) => {
  //   const icons: Record<string, string> = {
  //     'nutrition': '🥗',
  //     'exercise': '💪',
  //     'mental-health': '🧠',
  //     'sleep': '😴',
  //     'wellness': '✨',
  //     'meditation': '🧘',
  //     'stress-management': '🌿',
  //     'hormones': '🔄',
  //     'recipes': '👨‍🍳',
  //     'lifestyle': '🌟'
  //   };
  //   return icons[category] || '📚';
  // };

  // const getDifficultyColor = (difficulty: string) => {
  //   const colors: Record<string, string> = {
  //     'beginner': 'bg-green-100 text-green-800',
  //     'intermediate': 'bg-yellow-100 text-yellow-800',
  //     'advanced': 'bg-red-100 text-red-800'
  //   };
  //   return colors[difficulty] || 'bg-gray-100 text-gray-800';
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Resources</h1>
          <p className="text-gray-600">
            Discover health and wellness articles, tips, and guides to support your journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search articles, tips, guides..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'featured'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Featured
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <EducationalFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'all' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Resources ({resources.length})
                  </h2>
                  <div className="text-sm text-gray-500">
                    {loading ? 'Loading...' : `${resources.length} articles found`}
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map((resource) => (
                      <EducationalResourceCard
                        key={resource._id}
                        resource={resource}
                        onClick={() => handleResourceSelect(resource)}
                        onLike={() => handleLike(resource._id)}
                        showActions={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                    <p className="text-gray-500">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'featured' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Featured Resources
                  </h2>
                  <div className="text-sm text-gray-500">
                    {featuredResources.length} featured articles
                  </div>
                </div>

                {featuredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredResources.map((resource) => (
                      <EducationalResourceCard
                        key={resource._id}
                        resource={resource}
                        onClick={() => handleResourceSelect(resource)}
                        onLike={() => handleLike(resource._id)}
                        showActions={true}
                        featured={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No featured resources</h3>
                    <p className="text-gray-500">
                      Check back later for featured articles
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resource Detail Modal */}
        {selectedResource && (
          <EducationalResourceDetail
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
            onLike={() => handleLike(selectedResource._id)}
          />
        )}
      </div>
    </div>
  );
};

export default Educational;
