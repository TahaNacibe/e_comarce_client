"use client"

import { FilterSheet } from "@/app/components/dialog/filter_sheet";
import LoadingWidget from "@/app/components/loading_widget";
import PaginationWidget from "@/app/components/pagination_widget";
import ProductsDisplaySection from "@/app/components/products_section/products_display_section";
import CategoriesServices from "@/app/services/categories-services/categories_services";
import ProductsServices from "@/app/services/products-services/products_services";
import { SortOption, FilterState } from "@/app/types/filter_types";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import { Products, Tags } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

interface CategoriesPageInterFace {
    params: Promise<{ id: string }>;
  }


export default function CategoriesPage({params}:CategoriesPageInterFace) {
    //* manage state
    const [activePageIndex, setActivePageIndex] = useState(1)
    const [totalPagesCount, setTotalPagesCount] = useState(0)
    const [productsList, setProductsList] = useState<Products[]>([])
    const [categoriesList, setCategoriesList] = useState<Tags[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
     const [priceRange, setPriceRange] = useState<[number, number]>([0,100000]);
      const [specialOffers, setSpecialOffers] = useState<boolean>(true);
      const [sortBy, setSortBy] = useState<SortOption | ''>("newestToOldest");
    

    //* get the active key
    const resolvedParams = use(params);
    const searchParams = useSearchParams()
    const activeCategory = searchParams.get("category-name") || "Category search"
    
    //* instances
    const productsServices = new ProductsServices()
    const categoriesServices = new CategoriesServices()


    //* functions
    const getCategoriesList = async () => {
        const response = await categoriesServices.getCategoriesList(false)
        setCategoriesList(response.success? response.data : [])
    }


    const getProductsListForCategory = async () => {
        const response = await productsServices.getProductsListForSpecificCategory({ categoryId: resolvedParams.id, activePageIndex: activePageIndex })
        setProductsList(response.products)
        setTotalPagesCount(response.pagesCount)
    }


    // handle the data load
    const loadDataForTheCategoriesPage = async () => {
        getCategoriesList()
        getProductsListForCategory()
        setIsLoading(false)
    }

    useEffect(() => {
        loadDataForTheCategoriesPage()
    },[])


    async function jumpToNextPage(newIndex: number) {
        setIsLoading(true)
        const response = await productsServices.getProductsListForSpecificCategory({ categoryId: resolvedParams.id, activePageIndex: newIndex })
        setProductsList(response.products)
        setActivePageIndex(newIndex)
        setIsLoading(false)
    }


    async function updateFilters(filters: FilterState) {
        setIsLoading(true)
        setPriceRange(filters.priceRange)
        setSortBy(filters.sortBy)
        setSpecialOffers(filters.specialOffers)
        const response = await productsServices.getProductsListForSpecificCategory(
            { categoryId: resolvedParams.id, activePageIndex: 1, specialOffer: filters.specialOffers, sortBy: filters.sortBy, priceRange: filters.priceRange })
            setProductsList(response.products)
            setIsLoading(false)
    }

    //* ui tree
    return (
        <div className="px-2 py-4">
            <div className="absolute right-2 flex gap-2">
            <FilterSheet showSpecialOffersCheckBox={true} onApplyFilters={(filters:FilterState) => updateFilters(filters)} />
            {totalPagesCount > 1 && <PaginationWidget pagesCount={totalPagesCount} activePageIndex={activePageIndex}
                handlePageChange={(newIndex:number) => jumpToNextPage(newIndex)}
                    searchQuery={null} />}
            </div>
            {isLoading? <LoadingWidget /> : <ProductsDisplaySection title={capitalizeFirstLetter(activeCategory)} productsList={productsList} />}
        </div>
    )
}