import loadCarouselData from "@/app/services/products-services/carouse_data_loader";
import PromoBanner from "./carousel";




export default async function CarouselLoader() {
    const carouselData = await loadCarouselData()
    return (
        <PromoBanner newProducts={carouselData.newlyAddedProducts} offersProducts={carouselData.specialOffersProducts}  />
    )
}