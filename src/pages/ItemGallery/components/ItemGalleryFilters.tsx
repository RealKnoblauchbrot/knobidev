import { useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { INITIAL_CATEGORY_COUNT, SEARCH_DELAY_MS } from '../types';

interface ItemGalleryFiltersProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  showAllCategories: boolean;
  handleToggleCategories: () => void;
  availableSideCategories: string[];
  selectedSideCategories: string[];
  toggleSideCategory: (category: string) => void;
  startLoading: () => void;
  setSearchTerm: (term: string) => void;
  totalItems: number;
  filteredItems: number;
}

function ItemGalleryFilters({
  categories,
  selectedCategories,
  toggleCategory,
  showAllCategories,
  handleToggleCategories,
  availableSideCategories,
  selectedSideCategories,
  toggleSideCategory,
  startLoading,
  setSearchTerm,
  totalItems,
  filteredItems
}: ItemGalleryFiltersProps) {
  const searchTimeoutRef = useRef<number | null>(null);
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, INITIAL_CATEGORY_COUNT);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startLoading();
    const value = e.target.value;

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setSearchTerm(value);
    }, SEARCH_DELAY_MS);
  };

  return (
    <div className="itemgallery-filters">
      <div className="filters-top-row">
        <div className="category-filters">
          {visibleCategories.map(category => (
            <button
              key={category}
              className={`category-filter ${selectedCategories.includes(category) ? 'active' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}

          {categories.length > INITIAL_CATEGORY_COUNT && (
            <button
              className="category-filter more-button"
              onClick={handleToggleCategories}
            >
              {showAllCategories ? 'Less' : 'More'}
            </button>
          )}
        </div>

        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search items..."
              onChange={handleSearchChange}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
          
          <div className="item-count">
            Showing <span className="count-highlight">{filteredItems}</span> of <span className="count-highlight">{totalItems}</span> items
          </div>
        </div>
      </div>

      {selectedCategories.length > 0 && availableSideCategories.length > 0 && (
        <div className="side-category-filters">
          {availableSideCategories.map(category => (
            <button
              key={category}
              className={`side-category-filter ${selectedSideCategories.includes(category) ? 'active' : ''}`}
              onClick={() => toggleSideCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemGalleryFilters;
