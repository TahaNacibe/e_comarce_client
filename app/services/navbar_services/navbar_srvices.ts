import prisma from "@/utils/connect";

export async function getOnDisplayCategoriesData() {
    try {
        // Fetch data directly from the database 
        // apparently you can't use classes in SSR why? i don't know... 
        // google it it has something to do with js and server taking function out of classes so the this become undefined (o_o!) 
        const categories = await prisma.tags.findMany({
            where: { isOnDisplay: true },
            include: {
                //* okay didn't know we could do that (*u*?) i start go crazy
                _count: {
                    select: {
                        product:true
                    }
                }
            }
        });

        return categories
    } catch (error) {
        return []
    }
}


export async function getShopMetaData() {
    try {
        const metadata = await prisma.shopPreferences.findFirst(); 
        return metadata
    } catch (error) {
        return {
            shopIcon: "/image_placeholder.jpg",
            shopName: "Welcome here"
        }
    }
}