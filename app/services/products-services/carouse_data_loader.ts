import prisma from "@/utils/connect";

//* limit for the items without a discount 
const QUERY_LIMIT = 10;


//* load the data for the carousel 
export default async function loadCarouselData() {
    try {

        // fetch the newly added products
        const newlyAddedProducts = await prisma.products.findMany({
            orderBy: { updatedAt: "desc" },
            where: { isVisible: true, isInDiscount:false },
            include: {
                tags:true
            },
            take: QUERY_LIMIT,
        })


        // fetch the special offers 
        const specialOffersProducts = await prisma.products.findMany({
            where: { isInDiscount: true, isVisible: true },
            include: {
                tags:true
            },
        })

        //* return the data if exited
        return {
            newlyAddedProducts,
            specialOffersProducts
        }
    } catch (error) {
        //* don't crash just return the empty state
        return {
            newlyAddedProducts:[],
            specialOffersProducts:[]
        }
    }
}