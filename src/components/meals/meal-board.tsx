'use client';

import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { addDays, format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { addMealToPlan, removeMealFromPlan } from '@/actions/meal-actions';

type RecipeLite = {
  id: string;
  name: string;
  category?: string | null;
  imageUrl?: string | null;
};

type PlanItem = {
  id: string;
  date: Date | string;
  mealType: string;
  recipe: { id: string; name: string };
};

type Plan = {
  id: string;
  startDate: Date | string;
  items: PlanItem[];
};

function DraggableRecipe({ recipe }: { recipe: RecipeLite }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `recipe-${recipe.id}`,
    data: { recipeId: recipe.id, type: 'new-meal' },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-md border border-gray-200 bg-white p-3 text-sm shadow-sm hover:border-blue-500 active:cursor-grabbing"
    >
      <p className="truncate font-medium">{recipe.name}</p>
      <span className="text-xs capitalize text-gray-500">
        {recipe.category || 'Meal'}
      </span>
    </div>
  );
}

function DaySlot({
  date,
  mealType,
  items,
}: {
  date: Date;
  mealType: string;
  items: PlanItem[];
}) {
  const dateStr = date.toISOString();
  const { setNodeRef, isOver } = useDroppable({
    id: `${dateStr}::${mealType}`,
    data: { date: dateStr, mealType },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] rounded-lg border-2 p-2 transition-colors ${
        isOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-dashed border-gray-200 bg-gray-50/50'
      }`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative mb-2 rounded border border-blue-100 bg-white p-2 text-xs shadow-sm"
        >
          <span className="block truncate font-medium">{item.recipe.name}</span>
          <button
            onClick={() => removeMealFromPlan(item.id)}
            className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove meal"
          >
            <Trash2 className="h-3 w-3 text-red-400 hover:text-red-600" />
          </button>
        </div>
      ))}

      {items.length === 0 && (
        <span className="pointer-events-none text-xs capitalize text-gray-300">
          {mealType}
        </span>
      )}
    </div>
  );
}

export default function MealBoard({
  plan,
  recipes,
}: {
  plan: Plan;
  recipes: RecipeLite[];
}) {
  const startDate = new Date(plan.startDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startDate, i)
  );
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  const handleDragEnd = async (event: {
    active: { data: { current?: { type?: string; recipeId?: string } } };
    over: { data: { current?: { date?: string; mealType?: string } } } | null;
  }) => {
    const { active, over } = event;

    if (over && active?.data?.current?.type === 'new-meal') {
      const recipeId = active.data.current.recipeId as string;
      const date = over.data.current?.date;
      const mealType = over.data.current?.mealType;

      if (!date || !mealType) return;

      await addMealToPlan(plan.id, recipeId, date, mealType);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-200px)] flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full shrink-0 pr-2 lg:w-64">
          <div className="sticky top-0 rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-4 font-bold text-gray-700">Recipes</h3>
            <div className="space-y-2">
              {recipes.map((r) => (
                <DraggableRecipe key={r.id} recipe={r} />
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="min-w-[800px] flex-1 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="flex flex-col gap-2">
                <div className="rounded-lg bg-gray-100 py-2 text-center text-sm font-semibold">
                  {format(day, 'EEE d')}
                </div>

                {mealTypes.map((type) => {
                  const items = plan.items.filter((item) => {
                    const itemDate = new Date(item.date);
                    return (
                      itemDate.toDateString() === day.toDateString() &&
                      item.mealType === type
                    );
                  });

                  return (
                    <DaySlot
                      key={`${day.toISOString()}-${type}`}
                      date={day}
                      mealType={type}
                      items={items}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}


