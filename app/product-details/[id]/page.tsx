"use client"
import React, { use, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import ProductsServices from '@/app/services/products-services/products_services';
import { Tags } from '@prisma/client';
import LoadingWidget from '@/app/components/loading_widget';
import Image from 'next/image';
import ProductWidget from '@/app/components/product_item';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import OrderServices from '@/app/services/order-services/order_services';
import { CartContext } from '@/app/cart/context/cartContext';
import { useToast } from '@/hooks/use-toast';

type ValuesTypeForProperties = {
  value: string;
  changePrice: boolean;
  newPrice?: string;
}

type ProductsProperties = {
  label: string;
  values: ValuesTypeForProperties[];
  selectedValue: string | null;
}

interface Products {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  properties: ProductsProperties[];
  price: number;
  discountPrice?: number | null;
  isInDiscount: boolean;
  stockCount: number;
  soldCount: number;
  isVisible: boolean;
  bigImageUrl: string;
  smallImageUrls: string[];
  tagIds: string[];
  tags: Tags[];
}

type SelectedPropertyValue = {
  value: string;
  price?: string;
}

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage: React.FC<ProductDetailsPageProps> = ({params}) => {
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<Record<string, SelectedPropertyValue>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMainImage, setShowMainImage] = useState(false)
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [product, setProduct] = useState<Products>();
  const [relatedToProduct, setRelatedToProduct] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [productCount, setProductCount] = useState(1)
  
  
  const resolvedParams = use(params);
  const cartContext = useContext(CartContext);
  const productId = resolvedParams.id;
  const { toast } = useToast()
  
  const productsServices = new ProductsServices();
  const orderServices = new OrderServices()

  if (!cartContext) {
    throw new Error("CartContext is not available. Ensure CartContextProvider wraps the component tree.");
  }


  const {
    addOrUpdateCartItem,
  } = cartContext;



  const getProductDataAndRelatedItems = async () => {
    const response = await productsServices.getSingleProductDetailsForDisplay(productId);
    if (response.success) {
      setProduct(response.data.productData);
      setRelatedToProduct(response.data.relatedProducts);
    }
    setIsLoading(false)
  };

  const calculateFinalPrice = (): string => {
    let basePrice = product?.isInDiscount ? (product.discountPrice || 0) : product!.price;
    Object.values(selectedPropertyValues).forEach(value => {
      if (value.price) {
        basePrice += parseFloat(value.price);
      }
    });
    const priceWithProductsCount = basePrice * productCount
    return priceWithProductsCount.toFixed(2);
  };

  const handleProductCountChange = ({isAdd}:{isAdd?: boolean}) => {
      if (isAdd) {
        setProductCount(prev => prev + 1)
        
      } else if (!isAdd && productCount > 1) {
        setProductCount(prev => prev - 1)
      }
  }

  const handleProductCountChangeByInput = (value: string) => {
    let valueAsNumber = Number(value) || 0
    const productCountValue = valueAsNumber < 0? 0 : valueAsNumber
    setProductCount(productCountValue)

  }

  useEffect(() => {
    getProductDataAndRelatedItems();
  }, []);

  const handlePropertySelect = (propertyLabel: string, value: string, newPrice?: string) => {
    setSelectedPropertyValues(prev => ({
      ...prev,
      [propertyLabel]: { value, price: newPrice }
    }));
  };

  const isAddToCartDisabled = (): boolean => {
    if (!product) return true;
    return product.properties.some(prop => !selectedPropertyValues[prop.label]) || product.stockCount === 0 || productCount === 0;
  };


  
  function addProductToTheCart(): void {
    const productMetaDataForOrder = orderServices.createNewOrderProductMetaDataFromUserInput({
      productId,
      productName: product?.name!,
      quantity: productCount,
      productImage:product?.bigImageUrl ?? "",
      selectedProperties: Object.values(selectedPropertyValues) as any,
      totalPrice: calculateFinalPrice()
    })
    addOrUpdateCartItem(productMetaDataForOrder.data as any)
    toast({
      className:"bg-blue-800 text-white",
      title: "Product added to your cart!",
      description: "You can head directly to send order or browse more items"
    })

  }



  if (isLoading) {
    return <LoadingWidget />
  }

  if (!product) {
    return (
      <div>
        <Image src={'/404_error.svg'} alt={'empty'} width={300} height={300} />
        <h1> Couldn&apos;t get the product requested </h1>
      </div>
    );
  }
    

  return (
    <div className="max-w-7xl mx-auto p-6 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-md">
            <Image
              src={product.bigImageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover w-full h-full cursor-zoom-in transition hover:scale-105"
              onClick={() => setShowMainImage(true)}
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
                <Image
                  src={url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={300}
                  height={300}
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
        <div className="space-y-8 pt-4">
          <div className="space-y-4">
          <div className=" flex border-l-4 pl-4 mb-4 justify-between">
              <h1 className="text-2xl font-semibold">{product.name}</h1>
          </div>
            <div className="flex items-center gap-3 pt-1">
              <Badge variant={"outline"} className="text-xl font-medium">
                {calculateFinalPrice()} DZD
              </Badge>
              {product.isInDiscount && (
                <Badge variant={"secondary"} className="text-base text-gray-500 line-through">
                  {product.price} DZD
                </Badge>
              )}
            </div>
          </div>

          <p className={`text-gray-600 leading-relaxed line-clamp-3`}>{product.description}</p>

          <div className=" flex border-l-4 pl-4 mb-4 justify-between">
              <h1 className="text-2xl font-semibold">Properties</h1>
          </div>
          
          {/* properties */}
          <div className="space-y-4 p-1">
            {product.properties.map((property) => (
              <div key={property.label} className="space-y-3 gap-2">
                <Badge variant={"secondary"} className=" text-sm font-medium w-fit">
                  {property.label}
                </Badge>
                <div className="flex flex-wrap gap-3">
                  {property.values.map((value) => (
                    <div key={value.value} className="relative group">
                      <Button
                        variant={selectedPropertyValues[property.label]?.value === value.value ? "default" : "outline"}
                        className="min-w-[4rem] relative"
                        onClick={() => handlePropertySelect(property.label, value.value, value.newPrice ?? undefined)}
                      >
                        {value.value}
                      </Button>
                      {value.newPrice && <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                        {value.newPrice}Dzd
                      </div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* product count */}
          <div className='flex gap-2'>
            <Button onClick={() => handleProductCountChange({isAdd:false})}>
              <Minus />
            </Button>
            <Input
              className='max-w-28'
              value={productCount}
              onChange={(e) => handleProductCountChangeByInput(e.target.value)} />
            <Button onClick={() => handleProductCountChange({isAdd:true})}>
              <Plus />
            </Button>
          </div>

          
          {/* stock and sold count */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-t border-b py-4">
            <Badge variant={"outline"} className="flex items-center gap-2 bg-green-500/10 border-green-300/10">
              <div className="w-2 h-2 rounded-full text-green-700"></div>
              {product.stockCount} in stock
            </Badge>
            <span>{product.soldCount} sold</span>
          </div>

          <Button
            size="lg"
            className="w-full text-lg py-6 font-semibold tracking-wide"
            disabled={isAddToCartDisabled()}
            onClick={() => addProductToTheCart()}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <div className=" flex border-l-4 pl-4 mb-4 justify-between">
              <h1 className="text-2xl font-semibold">Categories</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag.id}>
              <Link href={`/categories/${tag.id}`} className="text-sm px-3 py-1">
                {tag.name}
              </Link>
              </Badge>
            ))}
          </div>
        </div>
      </div>

            {/* Related Products Carousel */}
            <div className="mt-16 space-y-6">
         {/* section title */}
      <div className=" flex border-l-4 pl-4 mb-4 justify-between">
              <h1 className="text-2xl font-semibold">Similar Products</h1>
      </div>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {relatedToProduct.map((relatedProduct) => (
              <CarouselItem key={relatedProduct.id} className="pl-2 md:pl-4 basis-full sm:basis-1 md:basis-1/3 lg:basis-1/5">
               <ProductWidget product={relatedProduct} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      {/* Full Screen Image Modal */}
      {(showLargeImage || showMainImage) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowLargeImage(false); setShowMainImage(false)}}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4 z-10 text-white"
            onClick={() => { setShowLargeImage(false);  setShowMainImage(false)}}
          >
            <X className="h-6 w-6" />
          </Button>
          <Image
            src={showMainImage? product.bigImageUrl : product.smallImageUrls[currentImageIndex]}
            alt={product.name}
            width={500}
            height={500}
            className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;

