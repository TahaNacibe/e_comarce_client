"use client"
import ProductsDisplaySection from "@/app/components/products_section/products_display_section";
import ProductsServices from "@/app/services/products-services/products_services";
import { Products } from "@prisma/client";
import { useEffect, useState } from "react";



export default function ProductsSectionForHomePage() {
    // manage state
    const [inDiscountProductsList, setInDiscountProductsList] = useState<Products[]>()
    const [newProductsList, setNewProductsList] = useState<Products[]>()
    const [isLoading, setIsLoading] = useState(true)

    // instances
    const productsServices = new ProductsServices()

    //* functions
    const loadProductsList = async () => {
        const discountProducts = await productsServices.loadProductsList({queryLimit:20,filterForDiscount:true})
        console.log(discountProducts)
        setInDiscountProductsList(discountProducts.data)
        const newProducts = await productsServices.loadProductsList({queryLimit:20,filterForDiscount:false})
        console.log(newProducts)
        setNewProductsList(newProducts.data)
        setIsLoading(false)
    }


    //* init load
    useEffect(() => {
        loadProductsList()
    }, [])
    

    if (isLoading) {
        return (
            <div></div>
        )
    }

    //* ui tree
    return (
        <div className="flex flex-col gap-8">
            {/* in discount products */}
            {inDiscountProductsList?.length! > 0 && <ProductsDisplaySection title={"Special Offers!"} productsList={inDiscountProductsList as any} />}
            {/* new Products products */}
            <ProductsDisplaySection title={"New Products Offers!"} productsList={newProductsList as any} />
        </div>
    )

}