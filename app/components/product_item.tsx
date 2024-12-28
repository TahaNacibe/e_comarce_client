import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, ShoppingCart, TicketPercent } from 'lucide-react';

// Separate types into their own interfaces for better organization
interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  isInDiscount: boolean;
  bigImageUrl: string;
  tags: Tag[];
}

interface Tag {
  id: string;
  name: string;
}

interface ProductWidgetProps {
  product: Product;
  isCarousel?: boolean;
  onAddToCart?: (productId: string) => void;
}

// Separate badge component for better reusability
const ProductBadge = ({ variant, children }: { variant: 'discount' | 'new', children: React.ReactNode }) => {
  const variantStyles = {
    discount: 'bg-red-500',
    new: 'bg-orange-500'
  };

  return (
    <Badge 
      className={`absolute ${variantStyles[variant]} text-white text-sm font-bold px-2 py-1 
        rounded-tl-lg rounded-bl-none z-20 flex items-center gap-1`}
    >
      {children}
    </Badge>
  );
};

// Separate price component for cleaner rendering logic
const ProductPrice = ({ price, discountPrice, isInDiscount }: { 
  price: number, 
  discountPrice?: number, 
  isInDiscount: boolean 
}) => (
  <div className="flex items-center gap-1">
    <span className="text-base font-semibold text-gray-900 pl-1">
      {(discountPrice ?? price).toFixed(2)} DZD
    </span>
    {isInDiscount && discountPrice && (
      <div className="text-xs text-gray-500 line-through align-middle">
        {price} DZD
      </div>
    )}
  </div>
);

const ProductWidget: React.FC<ProductWidgetProps> = ({ 
  product, 
  isCarousel = false,
  onAddToCart 
}) => {
  const handleAddToCart = () => {
    onAddToCart?.(product.id);
  };

  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <div className={`
      relative group transition-all duration-300
      ${isCarousel ? 'mt-24 hover:mt-16' : 'hover:-translate-y-2'}
    `}>
      {/* Badge Section */}
      {product.isInDiscount && product.discountPrice ? (
        <ProductBadge variant="discount">
          <TicketPercent className="h-4 w-4" />
          {calculateDiscount(product.price, product.discountPrice)}% OFF
        </ProductBadge>
      ) : isCarousel && (
        <ProductBadge variant="new">
          <Flame className="h-4 w-4" />
          New
        </ProductBadge>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 transition-shadow hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
          <img
            src={product.bigImageUrl}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </h3>

          {/* Tags */}
          <div className={`flex gap-1 flex-wrap ${!isCarousel && 'max-h-6 overflow-hidden'}`}>
            {product.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <ProductPrice 
            price={product.price}
            discountPrice={product.discountPrice}
            isInDiscount={product.isInDiscount}
          />

          {/* Add to Cart Button */}
          <Button
            variant="outline"
            onClick={handleAddToCart}
            className="w-full gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductWidget;