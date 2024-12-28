"use client"
import { FilterSheet } from "@/app/components/dialog/filter_sheet";
import LoadingWidget from "@/app/components/loading_widget";
import PaginationWidget from "@/app/components/pagination_widget";
import ProductsDisplaySection from "@/app/components/products_section/products_display_section";
import ProductsServices from "@/app/services/products-services/products_services";
import { SortOption, FilterState } from "@/app/types/filter_types";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import { Products } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { use, useEffect, useState } from "react";



interface ProductsPageInterFace {
    params: Promise<{ id: string }>;
  }

export default function ProductsPage({ params }: ProductsPageInterFace) {
    //* manage state
    const [activePageIndex, setActivePageIndex] = useState(1)
    const [totalPagesCount, setTotalPagesCount] = useState(0)
    const [productsList, setProductsList] = useState<Products[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    const [priceRange, setPriceRange] = useState<[number, number]>([0,100000]);
          const [specialOffers, setSpecialOffers] = useState<boolean>(true);
          const [sortBy, setSortBy] = useState<SortOption | ''>("newestToOldest");

    //* get the active key
    const resolvedParams = use(params);

    //* instances
    const productsServices = new ProductsServices()

    //* functions
    const getDataForThePage = async () => {
        const data = await productsServices.getProductsList({ activePageIndex: activePageIndex, sortBy: sortBy, priceRange: priceRange,activeKey:resolvedParams.id })
        setTotalPagesCount(data.pagesCount)
        setProductsList(data.products)
        setIsLoading(false)
    }

    
    async function jumpToNextPage(newPageIndex: number) {
        setIsLoading(true)
        const data = await productsServices.getProductsList({ activePageIndex: newPageIndex, sortBy: sortBy, priceRange: priceRange,activeKey:resolvedParams.id })
        setTotalPagesCount(data.pagesCount)
        setProductsList(data.products)
        setActivePageIndex(newPageIndex)
        setIsLoading(false)
    }

    async function updateFilters(filters: FilterState) {
        setIsLoading(true)
        setPriceRange(filters.priceRange)
        setSortBy(filters.sortBy)
        setSpecialOffers(filters.specialOffers)
        const response = await productsServices.getProductsList(
            { activePageIndex: 1, sortBy: filters.sortBy, priceRange: filters.priceRange,activeKey:resolvedParams.id })
            setProductsList(response.products)
            setIsLoading(false)
    }

    useEffect(() => {
        getDataForThePage()
    }, [activePageIndex])
    

    //* ui tree
    return (
        <div className="px-2 py-4">
            <div className="absolute right-2 flex gap-2">
            <FilterSheet onApplyFilters={(filters:FilterState) => updateFilters(filters)} />
            {totalPagesCount > 1 && <PaginationWidget pagesCount={totalPagesCount} activePageIndex={activePageIndex}
                handlePageChange={(newIndex:number) => jumpToNextPage(newIndex)}
                    searchQuery={null} />}
            </div>
            {isLoading? <LoadingWidget /> : <ProductsDisplaySection title={capitalizeFirstLetter(resolvedParams.id.replace('-'," "))} productsList={productsList} />}
        </div>
    )
}