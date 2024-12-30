import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";


const GET = async (req: NextRequest) => {
    try {
        const RELATED_PRODUCTS_COUNT = 20
        //* get the target product
        const { searchParams } = new URL(req.url)
        const productTargetId = searchParams.get("productId")

        //* in case no target supplied
        if (!productTargetId) return NextResponse.json({ message: "missing required parameter product id" }, { status: 400 })
        // get the product details
        const targetProduct = await prisma.products.findUnique({
            where: { id: productTargetId },
            include: {
                tags:true
            }
        })
        
        // check the result before continuing
        if(!targetProduct) return NextResponse.json({ message: "couldn't find the requested product" }, { status: 404 })

        //* get related products
        const tagsIds = targetProduct?.tagIds
        // fetch the products with the same tags and ignore the target product
        const relatedProducts = await prisma.products.findMany({
            where: {AND: [
                { tagIds: { hasSome: tagsIds } },
                { id: { not: productTargetId } },
                {isVisible: true}
            ]
            },
            include: {
                tags:true
            },
            orderBy: { soldCount: "desc" },
            take:RELATED_PRODUCTS_COUNT,
            
        })

        return NextResponse.json({message:"Data have been fetched",targetProduct,relatedProducts},{status:200})
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({message:"Error while fetching the data",error},{status:500})
          } else {
            return NextResponse.json({message:"Unknown Error while fetching the data"},{status:500})
          }
        
    }
}

export {GET}