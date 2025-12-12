'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTransition } from 'react';

interface RecipeFiltersProps {
  categories: string[];
}

export function RecipeFilters({ categories }: RecipeFiltersProps) {
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ throttleMs: 500 })
  );
  const [category, setCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const [_isPending, startTransition] = useTransition();

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => startTransition(() => setQuery(e.target.value))}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        <button
          onClick={() => setCategory('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            category === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
