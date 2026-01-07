import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Hash, FileText, Settings, BarChart3, Table } from 'lucide-react';

const categoryIcons = {
  form: FileText,
  variable: Hash,
  page: Settings,
  view: Table,
  report: BarChart3,
};

const categoryColors = {
  form: 'text-blue-600 bg-blue-50 border-blue-200',
  variable: 'text-green-600 bg-green-50 border-green-200',
  page: 'text-purple-600 bg-purple-50 border-purple-200',
  view: 'text-orange-600 bg-orange-50 border-orange-200',
  report: 'text-red-600 bg-red-50 border-red-200',
};

export default function AutoSuggest({ 
  suggestions, 
  onSelect, 
  onClose, 
  position,
  selectedIndex = 0 
}) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  // Reset index when suggestions change
  useEffect(() => {
    setCurrentIndex(0);
    itemRefs.current = [];
  }, [suggestions]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[currentIndex]) {
      itemRefs.current[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setCurrentIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setCurrentIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[currentIndex]) {
            handleSelect(suggestions[currentIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, currentIndex, onClose, handleSelect]);

  const handleSelect = useCallback((suggestion) => {
    onSelect(suggestion);
  }, [onSelect]);

  const handleMouseEnter = (index) => {
    setCurrentIndex(index);
  };

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const positionStyles = position ? {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 1000,
  } : {};

  return (
    <div 
      ref={listRef}
      className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm w-80 max-h-64 overflow-y-auto"
      style={positionStyles}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <ChevronDown className="h-3 w-3" />
          <span>Auto-suggestions ({suggestions.length})</span>
          {suggestions.length > 0 && suggestions[0].parentForm && (
            <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
              from {suggestions[0].parentForm}
            </span>
          )}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="py-1">
        {suggestions.map((suggestion, index) => {
          const IconComponent = categoryIcons[suggestion.type] || FileText;
          const colorClass = categoryColors[suggestion.type] || categoryColors.form;

          return (
            <div
              key={`${suggestion.type}-${suggestion.id}`}
              ref={el => itemRefs.current[index] = el}
              className={`px-3 py-2 cursor-pointer transition-colors duration-150 flex items-start gap-3 ${
                index === currentIndex 
                  ? 'bg-blue-50 border-l-2 border-l-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleSelect(suggestion)}
            >
              {/* Icon */}
              <div className={`p-1.5 rounded border ${colorClass} flex-shrink-0 mt-0.5`}>
                <IconComponent className="h-3 w-3" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.name}
                    </p>
                    
                    {/* Additional info for views and reports */}
                    {suggestion.parentForm && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        from {suggestion.parentForm}
                      </p>
                    )}
                    
                    {/* Type indicator */}
                    {suggestion.viewType && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {suggestion.viewType} view
                      </p>
                    )}
                    {suggestion.reportType && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {suggestion.reportType} report
                      </p>
                    )}
                  </div>
                  
                  {/* Category badge */}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full border flex-shrink-0 ${colorClass}`}>
                    {suggestion.type}
                  </span>
                </div>

                {/* ID preview (subtle) */}
                <p className="text-xs text-gray-400 mt-1 font-mono truncate">
                  {suggestion.id}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          ↑↓ Navigate • Enter Select • Esc Close
        </p>
      </div>
    </div>
  );
}