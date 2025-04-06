export interface GalleryItem {
  label: string;
  file: string;
  category: string[];
  sidecategory?: string[];
  license?: string;
  author?: string;
}

export interface Author {
  author: string;
  link: string;
}

export interface ItemGalleryConfig {
  title: string;
  description: string;
  sidecategories?: Record<string, string[]>;
  licenseTypes: Record<string, string>;
  authors: Record<string, Author>;
  items: GalleryItem[];
}

export const ITEMS_PER_PAGE = 12;
export const INITIAL_CATEGORY_COUNT = 5;
export const SEARCH_DELAY_MS = 300;
export const LOADING_ANIMATION_DURATION_MS = 400;
export const LOADING_HIDE_DELAY_MS = 100;
export const DATA_LOADING_TIMEOUT_MS = 500;
export const INTERSECTION_OBSERVER_THRESHOLD = 0.1;
