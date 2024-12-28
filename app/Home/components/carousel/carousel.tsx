"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProductWidget from "../../../components/product_item";
import { Products } from "@prisma/client"



  
//* black promo banner component
export default function PromoBanner({ newProducts, offersProducts }: { newProducts: Products[], offersProducts: Products[] }) {
  return (
    <div className="w-screen h-[70vh] bg-black/95 flex items-center justify-between pt-12 pb-8"> {/* Adjusted height */}
      {/* side title */}
      <h1 className="text-6xl p-8 max-w-96 text-white">Check What New And Limited Offers</h1>
      
      {/* items carousel */}
      <div className="pr-12">
        {newProducts.length && offersProducts.length > 0 && 
          <CarouselSpacing newProducts={newProducts} offersProducts={offersProducts} />
        }
      </div>
    </div>
  )
}







{/* carousel component */}
export function CarouselSpacing({ newProducts,offersProducts }: { newProducts: Products[], offersProducts:Products[] }) {

  {/* auto scroll controller */}
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
  )
  
  {/* ui tree */}
    return (
        <Carousel
        plugins={[plugin.current]}
             onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play as any}
        className="w-full max-w-4xl mt-12 h-fit">
        
        {/* special offers */}
        <CarouselContent className="-ml-1">
          {offersProducts.map((product: any, index: number) => (
            <CarouselItem key={index} className="pl-1 basis-1/3 ">
              <div className="p-4 ">
                <ProductWidget product={product} isCarousel={true} />
              </div>
            </CarouselItem>
          ))}

          {/* new products lastly added and not inDiscount max of 10 */}
          {newProducts.map((product: any, index: number) => (
            <CarouselItem key={index} className="pl-1 basis-1/3 ">
              <div className="p-4 ">
                <ProductWidget product={product} isCarousel={true}/>
              </div>
            </CarouselItem>
          ))}
          
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }