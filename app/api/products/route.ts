import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

const getOrderTypeBasedOnOrderByParameter = (orderByParameter: string) => {
  const orderKeys: Map<string, any> = new Map([
    ['newestToOldest', { createdAt: 'desc' }],
    ['oldestToNewest', { createdAt: 'asc' }],
    ['mostExpensive', { price: 'desc' }],
    ['cheapest', { price: 'asc' }],
    ['popular', { soldCount: 'desc' }] // Assuming you have a field like soldCount to track popularity
  ]);

  return orderKeys.get(orderByParameter) || { createdAt: 'desc' }; // Default to newestToOldest if invalid orderByParameter
}


const GET = async (req: NextRequest) => {
  try {
    //* Get request params
    const { searchParams } = new URL(req.url);

    //* Extract parameters with defaults
    const queryLimit = Number(searchParams.get("queryLimit")) || 10; // Default limit
    const activePage = Number(searchParams.get("activePage")) || 0; // Default to first page
    const filterForDiscount = searchParams.get("filterForDiscount") === "true";
    const categoryId = searchParams.get("categoryId") || undefined;
    const orderBy = searchParams.get("orderBy") || "desc";
    const priceRangeStart = Number(searchParams.get("priceRangeStart")) || undefined
    const priceRangeEnd = Number(searchParams.get("priceRangeEnd")) || undefined
    const searchQuery = searchParams.get("searchQuery") || undefined

    //* Build filters
    const filters: any = {
      isVisible: true,
      ...(filterForDiscount && { isInDiscount: filterForDiscount }),
      ...(categoryId &&  {
        tagIds: {
          has:categoryId
      }
      }),
      ...(priceRangeStart != undefined && { price: { gt: priceRangeStart } }),
      ...(priceRangeStart != undefined && {
        OR: [
          { price: { gt: priceRangeStart } },
          { discountPrice: { gt: priceRangeStart } },
        ],
      }),
      ...(priceRangeStart !== undefined && {
        AND: [
          {
            OR: [
              { discountPrice: { gte: priceRangeStart } },
              { AND: [{ discountPrice: null }, { price: { gte: priceRangeStart } }] },
            ],
          },
        ],
      }),
      ...(priceRangeEnd !== undefined && {
        AND: [
          {
            OR: [
              { discountPrice: { lte: priceRangeEnd } },
              { AND: [{ discountPrice: null }, { price: { lte: priceRangeEnd } }] },
            ],
          },
        ],
      }),
      ...(searchQuery && {name:{contains:searchQuery,mode: "insensitive",}})
    };

    
    //* build order rules
    const ordersRules = getOrderTypeBasedOnOrderByParameter(orderBy)
      
    //* Get total pages if pagination is required
    const itemsCount = await prisma.products.count({ where: filters });
    const pagesCount = Math.ceil(itemsCount / queryLimit);

    //* Fetch products
    const productsList = await prisma.products.findMany({
      skip: activePage * queryLimit,
      take: queryLimit,
      orderBy: ordersRules,
      where: filters,
      include: { tags: true },
    });

    return NextResponse.json(
      { message: "Products List loaded", productsList, pagesCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 }
    );
  }
};

export { GET };
