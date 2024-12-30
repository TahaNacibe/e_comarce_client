import CarouselLoader from "./components/carousel/carousel_loader";
import ProductsSectionForHomePage from "./components/products-display/products_display";

export default function HomePage() {
  return (
    <section className="transition-all">
      {/* Carousel Section */}
      <div className="mb-24 h-full snap-start">
        <CarouselLoader />
      </div>

      {/* Products Section */}
      <div className="pt-28 md:pt-1">
        <div className="">
          <ProductsSectionForHomePage />
        </div>
      </div>
    </section>
  );
}

