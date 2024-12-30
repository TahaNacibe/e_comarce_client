import { Products } from "@prisma/client";
import ProductWidget from "../product_item";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface productsDisplaySectionInterface {
  title: string;
  productsList: Products[];
}

export default function ProductsDisplaySection({
  title,
  productsList,
}: productsDisplaySectionInterface) {
  return (
    <div className="px-4 min-h-[70vh]">
      {/* section title */}
      <div className=" flex border-l-4 pl-4 mb-4 justify-between">
              <h1 className="text-2xl font-semibold">{title}</h1>
              {productsList.length === 20 && <Button variant={"outline"}> See More <ArrowRight /> </Button>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {/* display items */}
        {productsList.map((product, index) => (
          <ProductWidget product={product as any} key={product.id + index} />
        ))}
      </div>
    </div>
  );
}
