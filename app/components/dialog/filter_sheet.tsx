import { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FilterIcon, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Tags } from '@prisma/client';
import { FilterState, SortOption } from '@/app/types/filter_types';


interface PriceRange {
  min: number;
  max: number;
}

interface FilterSheetProps {
  onApplyFilters?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
    className?: string;
    showSpecialOffersCheckBox?: boolean,
    categoriesList?:Tags[]
}


const DEFAULT_PRICE_RANGE: [number, number] = [0, 100000];

export function FilterSheet({ 
  onApplyFilters, 
  initialFilters,
    className,
    showSpecialOffersCheckBox,
    categoriesList
}: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange ?? DEFAULT_PRICE_RANGE
  );
  const [specialOffers, setSpecialOffers] = useState<boolean>(
    initialFilters?.specialOffers ?? false
  );
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [sortBy, setSortBy] = useState<SortOption | ''>(
    initialFilters?.sortBy ?? ''
  );

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values as [number, number]);
  };

  const handleCategoryToggle = (category: Tags) => {
    setSelectedCategory(category.id);
  };

  const handlePriceInputChange = (
    index: 0 | 1,
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setPriceRange(prev => {
      const newRange: [number, number] = [...prev] as [number, number];
      newRange[index] = numValue;
      return newRange;
    });
  };

  const clearFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSpecialOffers(false);
    setSelectedCategory(undefined);
    setSortBy('');
  };

  const handleApplyFilters = () => {
    const filters: FilterState = {
      priceRange,
      specialOffers,
      categoryId:selectedCategory,
      sortBy
    };
    onApplyFilters?.(filters);
  };

  const getActiveFilterCount = (): number => {
    return (
      (selectedCategory ? 1 : 0) +
      (specialOffers ? 1 : 0) +
      (sortBy ? 1 : 0) +
      (priceRange[0] !== DEFAULT_PRICE_RANGE[0] || 
       priceRange[1] !== DEFAULT_PRICE_RANGE[1] ? 1 : 0)
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 ${className}`}
        >
          <FilterIcon className="h-4 w-4" />
          Filter
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-scroll">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between pt-4">
            <SheetTitle className='font-medium'>Filter Products</SheetTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters} 
              className="h-8 px-2 lg:px-3"
            >
              Clear All
            </Button>
          </div>
          <Separator />
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {/* Price Range Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Price Range</h3>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={priceRange[0] > 0? priceRange[0] : ""}
                  onChange={(e) => handlePriceInputChange(0, e.target.value)}
                  className="w-20 h-8"
                  min={0}
                  max={priceRange[1]}
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  value={priceRange[1] > 0? priceRange[1] : ""}
                  onChange={(e) => handlePriceInputChange(1, e.target.value)}
                  className="w-20 h-8"
                  min={priceRange[0]}
                  max={DEFAULT_PRICE_RANGE[1]}
                />
              </div>
            </div>
            <Slider
              min={0}
              max={100000}
              step={10}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="mt-2"
            />
          </div>

          <Separator />

{/* Categories Section */}
<div className="space-y-4">
  <h3 className="font-medium">Categories</h3>
  <div className="grid grid-cols-2 gap-2">
    {categoriesList && categoriesList.length > 0 && categoriesList.map((category) => (
      <div 
        key={category.id}
        className={`cursor-pointer hover:bg-accent ${
          selectedCategory === category.id ? '' : ''
        }`}
        onClick={() => handleCategoryToggle(category)}
      >
        <CardContent className="flex items-center justify-between p-3">
          <span className="text-sm">{category.name}</span>
          <Checkbox 
            checked={selectedCategory === category.id}
            onCheckedChange={() => handleCategoryToggle(category)}
          />
        </CardContent>
      </div>
    ))}
  </div>
</div>


          <Separator />          


          {/* Special Offers Section */}
          {showSpecialOffersCheckBox && <div className="flex items-center space-x-2">
            <Checkbox 
              id="special" 
              checked={specialOffers}
              onCheckedChange={(checked: boolean) => setSpecialOffers(checked)}
            />
            <Label htmlFor="special">Show special offers only</Label>
          </div>}

          <Separator />

          {/* Sort By Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Sort By</h3>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newestToOldest">Newest to Oldest</SelectItem>
                <SelectItem value="oldestToNewest">Oldest to Newest</SelectItem>
                <SelectItem value="mostExpensive">Price: High to Low</SelectItem>
                <SelectItem value="cheapest">Price: Low to High</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rated">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-row">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button 
              type="submit" 
              className="w-full"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}