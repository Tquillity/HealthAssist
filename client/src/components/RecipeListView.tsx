import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';

interface RecipeListViewProps {
  recipes: Recipe[];
  isAdmin: boolean;
  onDelete: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
}

type SortKey = 'name' | 'leanRole' | 'cookTime';
type SortDirection = 'asc' | 'desc';

const RecipeListView: React.FC<RecipeListViewProps> = ({
  recipes,
  isAdmin,
  onDelete,
  onEdit,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedRecipes = useMemo(() => {
    return [...recipes].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortKey) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'leanRole':
          valA = a.leanInfo?.leanRole?.toLowerCase() || '';
          valB = b.leanInfo?.leanRole?.toLowerCase() || '';
          break;
        case 'cookTime':
          valA = a.metadata.cookTime + a.metadata.prepTime; // Using total time
          valB = b.metadata.cookTime + b.metadata.prepTime;
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [recipes, sortKey, sortDirection]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="text-gray-400">↕</span>;
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const getLeanRoleColor = (role?: string) => {
    switch (role) {
      case 'Infrastructure':
        return 'bg-gray-100 text-gray-800';
      case 'Process':
        return 'bg-blue-100 text-blue-800';
      case 'Daily':
        return 'bg-green-100 text-green-800';
      case 'Treat':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Recipe Name</span>
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('leanRole')}
              >
                <div className="flex items-center space-x-1">
                  <span>Lean Role</span>
                  <SortIcon column="leanRole" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('cookTime')}
              >
                <div className="flex items-center space-x-1">
                  <span>Total Time</span>
                  <SortIcon column="cookTime" />
                </div>
              </th>
              {isAdmin && (
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRecipes.length > 0 ? (
              sortedRecipes.map((recipe) => (
                <tr
                  key={recipe._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {recipe.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {recipe.metadata.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLeanRoleColor(recipe.leanInfo?.leanRole)}`}
                    >
                      {recipe.leanInfo?.leanRole || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipe.metadata.prepTime + recipe.metadata.cookTime} min
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(recipe)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(recipe)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 4 : 3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No recipes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeListView;
