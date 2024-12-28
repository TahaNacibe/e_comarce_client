import { Tags } from "@prisma/client";

export type SortOption = 'newestToOldest' | 'oldestToNewest' | 'mostExpensive' | 'cheapest' | 'popular' | 'rated';

export  interface FilterState {
    priceRange: [number, number];
    specialOffers: boolean;
    selectedCategories?: Tags[];
  sortBy: SortOption | '';
  categoryId?: string
  }