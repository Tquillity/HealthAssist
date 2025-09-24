import React, { useState } from 'react';

interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  category?: string;
}

interface GroceryListProps {
  items: GroceryItem[];
  mealPlan?: {
    weekStartDate: string;
    weekEndDate: string;
  };
  onPrint?: () => void;
  onExport?: () => void;
}

const GroceryList: React.FC<GroceryListProps> = ({ items, mealPlan, onPrint, onExport }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');

  const toggleItem = (itemKey: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemKey)) {
      newChecked.delete(itemKey);
    } else {
      newChecked.add(itemKey);
    }
    setCheckedItems(newChecked);
  };

  const toggleAll = () => {
    if (checkedItems.size === items.length) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(items.map((_, index) => index.toString())));
    }
  };

  const getSortedItems = () => {
    const sorted = [...items];
    if (sortBy === 'category') {
      return sorted.sort((a, b) => {
        const categoryA = a.category || 'Other';
        const categoryB = b.category || 'Other';
        if (categoryA === categoryB) {
          return a.name.localeCompare(b.name);
        }
        return categoryA.localeCompare(categoryB);
      });
    }
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  };

  const getGroupedItems = () => {
    if (sortBy !== 'category') return { 'All Items': getSortedItems() };
    
    const grouped: { [key: string]: GroceryItem[] } = {};
    getSortedItems().forEach(item => {
      const category = item.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (quantity % 1 === 0) {
      return `${quantity} ${unit}`;
    }
    return `${quantity.toFixed(1)} ${unit}`;
  };

  const getProgressPercentage = () => {
    return items.length > 0 ? (checkedItems.size / items.length) * 100 : 0;
  };

  const groupedItems = getGroupedItems();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Grocery List</h2>
            {mealPlan && (
              <p className="text-gray-600">
                Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()} - {new Date(mealPlan.weekEndDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            {onPrint && (
              <button
                onClick={onPrint}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Print
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Export
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {checkedItems.size} of {items.length} items
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAll}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {checkedItems.size === items.length ? 'Uncheck All' : 'Check All'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grocery Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              <p className="text-sm text-gray-500">
                {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {categoryItems.map((item, index) => {
                const itemKey = `${category}-${index}`;
                const isChecked = checkedItems.has(itemKey);
                
                return (
                  <div 
                    key={itemKey}
                    className={`px-6 py-4 flex items-center space-x-4 transition-colors ${
                      isChecked ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(itemKey)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          isChecked ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </p>
                        <p className={`text-sm ${
                          isChecked ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {formatQuantity(item.quantity, item.unit)}
                        </p>
                      </div>
                      {item.notes && (
                        <p className={`text-xs mt-1 ${
                          isChecked ? 'text-green-500' : 'text-gray-500'
                        }`}>
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{items.length}</div>
            <div className="text-sm text-gray-500">Total Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{checkedItems.size}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{items.length - checkedItems.size}</div>
            <div className="text-sm text-gray-500">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;
