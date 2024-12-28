import CarouselLoader from "./components/carousel/carousel_loader";
import ProductsSectionForHomePage from "./components/products-display/products_display";

export default function HomePage() {
  return (
    <section className="snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth transition-all">
      {/* Carousel Section */}
      <div className="mb-24 h-full snap-start">
        <CarouselLoader />
      </div>

      {/* Products Section */}
      <div className="h-screen snap-start pt-4 overflow-hidden">
        <div className="h-full overflow-y-auto scroll-smooth">
          <ProductsSectionForHomePage />
        </div>
      </div>
    </section>
  );
}

