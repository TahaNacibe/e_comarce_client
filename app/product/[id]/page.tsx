import React, { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShoppingCart, X } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductsServices from '@/app/services/products-services/products_services';
import { Products } from '@prisma/client';

type ValuesTypeForProperties = {
  value: string;
  changePrice: boolean;
  newPrice: string;
}

type ProductProperties = {
  label: string;
  values: ValuesTypeForProperties[];
  selectedValue: string | null;
}

type Product = {
  id: string;
  name: string;
  description: string;
  properties: ProductProperties[];
  price: number;
  discountPrice?: number;
  isInDiscount: boolean;
  stockCount: number;
  soldCount: number;
  isVisible: boolean;
  bigImageUrl: string;
  smallImageUrls: string[];
  tagIds: string[];
  tags: string[];
}

type RelatedProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  tags: string[];
}

type SelectedPropertyValue = {
  value: string;
  price: string;
}

interface ProductDetailsPageInterface {
    params: Promise<{ id: string }>;
  }


const ProductDetailPage = ({params}:ProductDetailsPageInterface) => {
  //* manage the state
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<Record<string, SelectedPropertyValue>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLargeImage, setShowLargeImage] = useState(false);
    const [product, setProducts] = useState<Products>()
    
    //* get the product id
    const resolvedParams = use(params);
    const productId = resolvedParams.id

    
    //* instances 
    const productsServices = new ProductsServices()

    async function getProductDataAndRelatedItems() {
        
    }
  

  const handlePropertySelect = (propertyLabel: string, value: string, newPrice: string) => {
    setSelectedPropertyValues(prev => ({
      ...prev,
      [propertyLabel]: { value, price: newPrice }
    }));
  };

  const isAddToCartDisabled = (): boolean => {
    return product.properties.some(prop => !selectedPropertyValues[prop.label]) || product.stockCount === 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-md">
            <img
              src={product.bigImageUrl}
              alt={product.name}
              className="object-cover w-full h-full cursor-zoom-in transition hover:scale-105"
              onClick={() => setShowLargeImage(true)}
            />
            {product.isInDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500">
                Sale
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.smallImageUrls.map((url, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setShowLargeImage(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ${product.isInDiscount ? product.discountPrice : product.price}
              </span>
              {product.isInDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="space-y-6">
            {product.properties.map((property) => (
              <div key={property.label} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  {property.label}
                </label>
                <div className="flex flex-wrap gap-3">
                  {property.values.map((value) => (
                    <div key={value.value} className="relative group">
                      <Button
                        variant={selectedPropertyValues[property.label]?.value === value.value ? "default" : "outline"}
                        className="min-w-[4rem] relative"
                        onClick={() => handlePropertySelect(property.label, value.value, value.newPrice)}
                      >
                        {value.value}
                      </Button>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                        ${value.newPrice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 border-t border-b py-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {product.stockCount} in stock
            </span>
            <span>{product.soldCount} sold</span>
          </div>

          <Button
            size="lg"
            className="w-full text-lg py-6 font-semibold tracking-wide"
            disabled={isAddToCartDisabled()}
            onClick={() => alert('Added to cart!')}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      <div className="mt-16 space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {relatedProducts.map((relatedProduct) => (
              <CarouselItem key={relatedProduct.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Card className="overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 truncate">{relatedProduct.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">
                        ${relatedProduct.price}
                      </span>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Full Screen Image Modal */}
      {showLargeImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLargeImage(false)}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4 z-10 text-white"
            onClick={() => setShowLargeImage(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={product.smallImageUrls[currentImageIndex]}
            alt={product.name}
            className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;