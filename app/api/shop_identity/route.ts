import prisma from "@/utils/connect"
import { NextResponse } from "next/server"


//* get the shop identity
const GET = async () => {
    try {
        //* get the shop only first metData 
        const shopIdentity = await prisma.shopPreferences.findUnique({
        where:{shopId:"0"}
        })
        
        //* if shop identity exist
        if (shopIdentity) {
            return NextResponse.json({message:"MetaData Loaded",shopIdentity},{status:200})
        }

        //* if no shop identity exist return the default call
        return NextResponse.json({message:"No Default MetaData was set"},{status:404})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Something went wrong while fetching the store metaData!"},{status:500})
    }
}


export {GET}