import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";



const GET = async (req: NextRequest) => {
    try {
        
        // check if the request ask for the visible categories
        const { searchParams } = new URL(req.url)
        const isRequestingVisibleItems = searchParams.get("isRequestingVisibleItems") === "true"

            //* get only the categories with the display  on
            const categoriesList = await prisma.tags.findMany({
                where:isRequestingVisibleItems? {isOnDisplay:true} : undefined
            })

            return NextResponse.json({message:"On display items loaded",categoriesList},{status:200,headers: {
                'Cache-Control': 'no-store' // Prevent caching for dynamic data
              }})
    } catch (error) {
        return NextResponse.json({message:"Error fetching the categories!",error},{status:500})
    }
}


export {GET}