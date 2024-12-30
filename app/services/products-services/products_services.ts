export default class ProductsServices {


    //* get item for the discount offers row
    loadProductsList = async ({ queryLimit, filterForDiscount }:{queryLimit?:number,filterForDiscount?:boolean}) => {
        // limit of items fetched for this category
        try {
            //* append the required params
            const searchParams = new URLSearchParams()
            if(queryLimit) searchParams.append("queryLimit", queryLimit.toString())
            if (filterForDiscount !== undefined) searchParams.append("filterForDiscount", filterForDiscount.toString())
            
            
            //* fetch the products 
            const response = await fetch(`/api/products?${searchParams}`, {
                method:"GET"
            })

            //* check response
            if (response.ok) {
                const data = await response.json()
                // return the list of items
                return {success:true, message:"Loaded!",data:data.productsList};
            }

            // in error case return 
            return {success:false, message:"Couldn't fetch the items!",data:[]};
        } catch (error:any) {
            return {success:false, message:"Failed to fetch the items!",data:[]};
        }
    }


     //* fetch the data
    async getProductsList({activePageIndex,priceRange,sortBy,activeKey }
      : { activePageIndex: number, priceRange?: [number, number], sortBy?: string,activeKey:string }) {
        //* const
        const ID_KEYS = ["special-offers", "all-products", "top-products"]
        const QUERY_LIMIT = "20"
        let orderByRule = sortBy ?? "desc"
        const BASE_URL = `/api/products`;


        //* append the search params
        const params = new URLSearchParams({
          activePage: (activePageIndex - 1).toString(),
          queryLimit: QUERY_LIMIT,
          orderBy:orderByRule,
        });
      
        if (priceRange) {
          params.append("priceRangeStart",priceRange[0].toString())
          params.append("priceRangeEnd",priceRange[1].toString())
        } 
      

        //* check conditions and apply params
        if (activeKey === ID_KEYS[0]) params.append("filterForDiscount", "true");
        if (activeKey === ID_KEYS[2]) params.append("isByTop", "true");
      

        //* do actual request
        try {
            const response = await fetch(`${BASE_URL}?${params}`);
            // failed case
            if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            
          //* else get the data
          const data = await response.json();
          return { products: data.productsList ?? [], pagesCount: data.pagesCount };
        } catch (error) {
          console.error("Error fetching data:", error);
          return { products: [], pagesCount: 0 };
        }
    }

  
  

    //* get products List for a specific category
  async getProductsListForSpecificCategory({ categoryId, activePageIndex,priceRange,sortBy,specialOffer }
    : { categoryId: string, activePageIndex: number, priceRange?: [number, number], sortBy?: string, specialOffer?: boolean }) {
        try {
            //* const
            const BASE_URL = `/api/products`;
            const QUERY_LIMIT = "20"
            const orderByRule = sortBy ?? "desc"

            //* form the search url
            const searchParams = new URLSearchParams({
                activePage: (activePageIndex - 1).toString(),
                queryLimit: QUERY_LIMIT,
                orderBy: orderByRule,
              });
          searchParams.append("categoryId", categoryId)
          if (specialOffer) searchParams.append("filterForDiscount", specialOffer.toString())
          if (priceRange) {
            searchParams.append("priceRangeStart",priceRange[0].toString())
            searchParams.append("priceRangeEnd",priceRange[1].toString())
          } 
            
            const response = await fetch(`${BASE_URL}?${searchParams}`);
            // failed case
            if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
            }
             //* else get the data
          const data = await response.json();
          return { products: data.productsList ?? [], pagesCount: data.pagesCount };
        } catch (error) {
            console.error("Error fetching data:", error);
          return { products: [], pagesCount: 0 };
        }
  }
  

    //* get products List for a specific category
  async getProductsListForSearchPage({ categoryId, activePageIndex,priceRange,sortBy,specialOffer, searchQuery}
    : { categoryId?: string, activePageIndex: number, priceRange?: [number, number], sortBy?: string, specialOffer?: boolean,searchQuery:string }) {
        try {
            //* const
            const BASE_URL = `/api/products`;
            const QUERY_LIMIT = "20"
            let orderByRule = sortBy ?? "desc"

            //* form the search url
            const searchParams = new URLSearchParams({
                activePage: (activePageIndex - 1).toString(),
                queryLimit: QUERY_LIMIT,
              orderBy: orderByRule,
              searchQuery: searchQuery
            });
          
          if (categoryId) searchParams.append("categoryId", categoryId)
          if (specialOffer) searchParams.append("filterForDiscount", specialOffer.toString())
          if (priceRange) {
            searchParams.append("priceRangeStart",priceRange[0].toString())
            searchParams.append("priceRangeEnd",priceRange[1].toString())
          } 
            
            const response = await fetch(`${BASE_URL}?${searchParams}`);
            // failed case
            if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
            }
             //* else get the data
          const data = await response.json();
          return { products: data.productsList ?? [], pagesCount: data.pagesCount };
        } catch (error) {
            console.error("Error fetching data:", error);
          return { products: [], pagesCount: 0 };
        }
  }
  

  async getSingleProductDetailsForDisplay(targetId: string){
    try {
      if(!targetId) return {success:false, message:"Missing the product id",data:null}
      //* get the products data
      const response = await fetch(`/api/details?productId=${targetId}`)
      if (response.ok) {
        const data = await response.json()
        return {success:true, message:"Loaded all data",data:{productData:data.targetProduct,relatedProducts:data.relatedProducts}}
      }
      return {success:false, message:"Failed to fetch the data",data:null}
    } catch (error:any) {
      return {success:false, message:"Error getting product data",data:error.message}
    }
  }

}