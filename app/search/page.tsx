"use client"
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import { useSearchParams } from "next/navigation";
import { FilterSheet } from "../components/dialog/filter_sheet";
import LoadingWidget from "../components/loading_widget";
import PaginationWidget from "../components/pagination_widget";
import ProductsDisplaySection from "../components/products_section/products_display_section";
import { FilterState, SortOption } from "../types/filter_types";
import { Products, Tags } from "@prisma/client";
import { useEffect, useState } from "react";
import CategoriesServices from "../services/categories-services/categories_services";
import ProductsServices from "../services/products-services/products_services";


export default function SearchPage() {

    //* manage state
    const [activePageIndex, setActivePageIndex] = useState(1)
    const [totalPagesCount, setTotalPagesCount] = useState(0)
    const [productsList, setProductsList] = useState<Products[]>([])
    const [categoriesList, setCategoriesList] = useState<Tags[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 1000000],
        specialOffers: false,
        sortBy: "newestToOldest",
        categoryId:undefined
    })
        

    
    //* instances
    const productsServices = new ProductsServices()
    const categoriesServices = new CategoriesServices()
    
    //* search query 
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("q")

    //* set search page title
    const searchPageTitle = searchQuery || "Looking for something?"

    //* functions
    const getCategoriesList = async () => {
        const response = await categoriesServices.getCategoriesList(false)
        setCategoriesList(response.success? response.data : [])
    }

    const getSearchResult = async ({activePageIndex}:{activePageIndex:number}) => {
        const response = await productsServices.getProductsListForSearchPage(
            { categoryId: filters.categoryId, activePageIndex, priceRange:filters.priceRange, sortBy:filters.sortBy, specialOffer: filters.specialOffers, searchQuery: searchQuery ?? "" })
        setTotalPagesCount(response.pagesCount)
        setProductsList(response.products)
    }

    // handle the initial load of data 
    const initialLoadOfData = async () => {
        await getCategoriesList()
        await getSearchResult({ activePageIndex })
        setIsLoading(false)
    }
    

    useEffect(() => {
        initialLoadOfData()
    },[])

    async function updateFilters(filters: FilterState) {
        setFilters(filters)
        const response = await productsServices.getProductsListForSearchPage(
            { categoryId: filters.categoryId, activePageIndex:1, priceRange:filters.priceRange, sortBy:filters.sortBy, specialOffer: filters.specialOffers, searchQuery: searchQuery ?? "" })
        setTotalPagesCount(response.pagesCount)
        setProductsList(response.products)
    }

    async function jumpToNextPage(newIndex: number) {
        await getSearchResult({ activePageIndex: newIndex })
        setActivePageIndex(newIndex)
    }

     //* ui tree
     return (
        <div className="px-2 py-4">
            <div className="absolute right-2 flex gap-2">
                 <FilterSheet
                     showSpecialOffersCheckBox={true}
                     categoriesList={categoriesList}
                     onApplyFilters={(filters: FilterState) => updateFilters(filters)} />
            {totalPagesCount > 1 && <PaginationWidget pagesCount={totalPagesCount} activePageIndex={activePageIndex}
                handlePageChange={(newIndex:number) => jumpToNextPage(newIndex)}
                    searchQuery={null} />}
            </div>
            {isLoading? <LoadingWidget /> : <ProductsDisplaySection title={capitalizeFirstLetter(searchPageTitle)} productsList={productsList} />}
        </div>
    )
}