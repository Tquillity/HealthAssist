import { Suspense } from 'react';
import { getRecipes, getRecipeCategories } from '@/actions/recipe-actions';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { RecipeFilters } from '@/components/recipes/recipe-filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse params
  const query = typeof params.q === 'string' ? params.q : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

  // Parallel data fetching
  const [recipesResult, categories] = await Promise.all([
    getRecipes({ query, category }),
    getRecipeCategories(),
  ]);

  const recipes = recipesResult.data || [];

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Recipes
          </h1>
          <p className="mt-2 text-gray-500">
            Browse your household collection and official recipes.
          </p>
        </div>
        <Link href="/recipes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Recipe
          </Button>
        </Link>
      </div>

      <RecipeFilters categories={categories} />

      <Suspense fallback={<RecipeGridSkeleton />}>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-lg font-medium text-gray-900">No recipes found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}

function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}
