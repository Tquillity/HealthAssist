import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesAPI } from '../services/api';
import { Recipe } from '../types';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import RecipeFiltersComponent from '../components/RecipeFilters';
import RecipeForm from '../components/RecipeForm';
import RecipeDetail from '../components/RecipeDetail';

interface RecipeFilters {
  category?: string;
  difficulty?: string;
  dietaryTags?: string[];
  search?: string;
  cuisine?: string;
}

const Recipes: React.FC = () => {
  const { state } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const isAdmin = state.user?.role === 'admin';

  // Fetch recipes with React Query
  const {
    data: recipes = [],
    isLoading,
    isError,
    error,
  } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: () => recipesAPI.getAll(),
  });

  // Filter recipes using useMemo for performance
  const filteredRecipes = useMemo(() => {
    let filtered = [...recipes];

    if (filters.category) {
      filtered = filtered.filter(
        (recipe) => recipe.metadata.category === filters.category
      );
    }
    if (filters.difficulty) {
      filtered = filtered.filter(
        (recipe) => recipe.metadata.difficulty === filters.difficulty
      );
    }
    if (filters.dietaryTags && filters.dietaryTags.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.metadata.dietaryTags.some((tag) =>
          filters.dietaryTags!.includes(tag)
        )
      );
    }
    if (filters.cuisine) {
      filtered = filtered.filter((recipe) =>
        recipe.metadata.cuisine
          .toLowerCase()
          .includes(filters.cuisine!.toLowerCase())
      );
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm) ||
          recipe.metadata.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm)
          ) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.name.toLowerCase().includes(searchTerm)
          )
      );
    }

    return filtered;
  }, [recipes, filters]);

  // Mutations for CRUD operations
  const deleteRecipeMutation = useMutation({
    mutationFn: (id: string) => recipesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      setShowDetail(false);
      setSelectedRecipe(null);
    },
    onError: (error) => {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    },
  });

  const createRecipeMutation = useMutation({
    mutationFn: (data: Partial<Recipe>) => recipesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      setShowForm(false);
      setEditingRecipe(null);
    },
    onError: (error) => {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe. Please try again.');
    },
  });

  const updateRecipeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Recipe> }) =>
      recipesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      setShowForm(false);
      setEditingRecipe(null);
    },
    onError: (error) => {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe. Please try again.');
    },
  });

  const handleFilterChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDetail(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
    setShowDetail(false);
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipeMutation.mutate(recipe._id);
    }
  };

  const handleFormSubmit = async (recipeData: Partial<Recipe>) => {
    if (editingRecipe) {
      updateRecipeMutation.mutate({ id: editingRecipe._id, data: recipeData });
    } else {
      createRecipeMutation.mutate(recipeData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedRecipe(null);
  };

  if (showForm) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
          </h1>
          <p className="text-gray-600">
            {editingRecipe
              ? 'Update your recipe details'
              : 'Create a new recipe for your collection'}
          </p>
        </div>
        <RecipeForm
          recipe={editingRecipe || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={
            createRecipeMutation.isPending || updateRecipeMutation.isPending
          }
        />
      </div>
    );
  }

  if (showDetail && selectedRecipe) {
    return (
      <div className="max-w-7xl mx-auto">
        <RecipeDetail
          recipe={selectedRecipe}
          onEdit={() => handleEditRecipe(selectedRecipe)}
          onDelete={() => handleDeleteRecipe(selectedRecipe)}
          onClose={handleCloseDetail}
          showActions={true}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recipe Database
            </h1>
            <p className="text-gray-600">
              Discover and manage your healthy recipes
            </p>
            {!isAdmin && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> Only admin users
                  can add, edit, or delete recipes. Contact your administrator
                  to add new recipes to the database.
                </p>
              </div>
            )}
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Recipe
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <RecipeFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {filteredRecipes.length} recipe
          {filteredRecipes.length !== 1 ? 's' : ''} found
        </p>
        {Object.values(filters).some(
          (value) => value && (Array.isArray(value) ? value.length > 0 : true)
        ) && (
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading recipes
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message ||
              'Something went wrong while loading recipes. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onClick={() => handleRecipeClick(recipe)}
              onEdit={isAdmin ? () => handleEditRecipe(recipe) : undefined}
              onDelete={isAdmin ? () => handleDeleteRecipe(recipe) : undefined}
              showActions={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600 mb-6">
            {Object.values(filters).some(
              (value) =>
                value && (Array.isArray(value) ? value.length > 0 : true)
            )
              ? 'Try adjusting your filters or clear them to see all available recipes.'
              : 'Start by adding your first recipe to your collection.'}
          </p>
          <div className="space-x-4">
            {Object.values(filters).some(
              (value) =>
                value && (Array.isArray(value) ? value.length > 0 : true)
            ) && (
              <button
                onClick={clearFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Your First Recipe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
