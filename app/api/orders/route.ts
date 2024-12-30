import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";



const POST = async (req:NextRequest) => {
    try {
        const order = await req.json()
        if (!order) return NextResponse.json({ message: "Didn't find any order data" }, { status: 400 })
        await prisma.orders.create({
        data:order})
        return NextResponse.json({message:"order created!"},{status:200})
    } catch (error:unknown) {
        if (error instanceof Error) {
            return NextResponse.json({message:error.message,error},{status:500})
        }
        return NextResponse.json({message:"unknown error!"},{status:500})
    }
}       


const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")
        if (!userId) return NextResponse.json({ message: "missing required params user id" }, { status: 400 })
        
        const userOrdersRecord = await prisma.orders.findMany({
            where:{userId:userId}
        })

        return NextResponse.json({message:"record loaded",userOrdersRecord},{status:200,headers: {
            'Cache-Control': 'no-store' // Prevent caching for dynamic data
          }})
    } catch (error) {
        return NextResponse.json({message:"Error getting the records",error},{status:500})
    }
}

export {POST,GET}