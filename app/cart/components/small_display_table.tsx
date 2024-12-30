import { Badge } from "@/components/ui/badge"
import { ProductsDisplayInterface } from "../types"
import { Button } from "@/components/ui/button"
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"
import Image from "next/image"



export default function MobileFriendlyProductsDisplay({cartItems,handleQuantityChange,removeCartItem}:ProductsDisplayInterface) {
    {/* Mobile-Friendly Cart Items Display */}
    return (
    <div className="flex flex-col gap-4 md:hidden">
    {cartItems.map((item) => (
    <div key={`${item.productId}-${JSON.stringify(item.selectedProperties)}`} className="bg-white px-4 py-1 space-y-3 border-b">
      {/* Product Image and Name */}
      <div className="flex items-center gap-3">
          <Image
          width={300}
          height={300}
          src={item.productImage}
          alt={item.productName}
          className="w-16 h-16 object-cover rounded-md"
        />
        <span className="font-medium text-lg">{item.productName}</span>
      </div>

      {/* Product Properties */}
      <div className="text-sm text-gray-500 flex flex-wrap gap-2">
        {Array.isArray(item.selectedProperties)
          ? item.selectedProperties.map((sub, index) => (
              <Badge key={index} className="flex flex-col text-xs">
                <span>{sub.value}</span>
                {sub.price && <span className="text-xs text-gray-400">{`+${sub.price} DZD`}</span>}
              </Badge>
            ))
          : "No properties selected"}
      </div>

      {/* Quantity and Price */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(item, -1)}
            className="h-8 w-8"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <span className="text-lg">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(item, 1)}
            className="h-8 w-8"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-right text-lg font-semibold">
          {(parseFloat(item.totalPrice) * item.quantity).toFixed(2)} DZD
        </div>
      </div>

      {/* Remove Button */}
      <div className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeCartItem(item.productId, item.selectedProperties as any)}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))}
</div>

    )
}