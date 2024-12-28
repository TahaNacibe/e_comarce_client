export default class CategoriesServices {

    //* get on display categories
    getCategoriesList = async (isOnlyOnDisplayItems:boolean) => {
        try {
            //* fetch the items 
            const response = await fetch(`/api/categories?isRequestingVisibleItems=${isOnlyOnDisplayItems}`, {
                method:"GET"
            })

            if (response.ok) {
                const data = await response.json()
                return {success: true, message:"Categories loaded!",data:data.categoriesList}
            }

            return {success: false, message:"couldn't load the categories!",data:response}
        } catch (error:any) {
            return {success: false, message:"Failed to load the categories!",data:error.message}
        }
    }
}