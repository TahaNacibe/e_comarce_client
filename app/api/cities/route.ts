import prisma from "@/utils/connect"
import { NextResponse } from "next/server"



const GET = async () => {
    try {
        const citiesList = await prisma.deliveryFee.findMany()
        if (citiesList) {
            return NextResponse.json({message:"cities loaded",data:citiesList})
        }
        return NextResponse.json({message:"cities not found", data:[]})
    } catch (error) {
        return NextResponse.json({message:"error loading cities", data:[]})
    }
}


export { GET }