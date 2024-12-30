import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { ProductsDisplayInterface } from "../types";
import Image from "next/image";


export default function WideScreenProductsTable({cartItems,handleQuantityChange,removeCartItem}:ProductsDisplayInterface) {
    return (
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={`${item.productId}-${JSON.stringify(item.selectedProperties)}`}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Image
                    width={300}
                    height={300}
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <span>{item.productName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-500 flex gap-2">
                  {Array.isArray(item.selectedProperties)
                    ? item.selectedProperties.map((sub, index) => (
                        <Badge key={index} className="flex flex-col text-xs">
                          <span>{sub.value}</span>
                          {sub.price && <span className="text-xs text-gray-400">{`+${sub.price} DZD`}</span>}
                        </Badge>
                      ))
                    : "No properties selected"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item, -1)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item, 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {(parseFloat(item.totalPrice) * item.quantity).toFixed(2)} DZD
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeCartItem(item.productId, item.selectedProperties as any)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}