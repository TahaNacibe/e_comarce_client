"use client"

import { createContext, ReactNode, useState } from "react";

// Define the shape of the context state
interface CartContextType {
  cartProducts: string[];
  isProductInTheCart: (productId: string) => boolean;
  changeProductStateInCart: (productId: string, actionIsAdd?: boolean) => void;
  removeProductFromCart: (productId: string) => void;
  getItemCountInTheCart: (productId: string) => number;
}

// Define the shape of the provider's props
interface CartContextProviderProps {
  children: ReactNode;
}

// Create context with an initial value (use `null` and handle it in the consumer for safety)
export const CartContext = createContext<CartContextType | null>(null);

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartProducts, setCartProducts] = useState<string[]>([]);

  //* Check if the product is in the cart already
  function isProductInTheCart(productId: string): boolean {
    return cartProducts.includes(productId);
  }

  //* Handle the add/remove action for the product in the cart
  function changeProductStateInCart(productId: string, actionIsAdd = true): void {
    setCartProducts((prev) =>
      actionIsAdd ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  }

  //* Handle removing a product completely from the cart
  function removeProductFromCart(productId: string): void {
    setCartProducts((prev) => prev.filter((id) => id !== productId));
  }

  //* Get the count of a specific item in the cart
  function getItemCountInTheCart(productId: string): number {
    return cartProducts.filter((id) => id === productId).length;
  }

  //* Return the provider with the context value
  return (
    <CartContext.Provider
      value={{
        cartProducts,
        isProductInTheCart,
        changeProductStateInCart,
        removeProductFromCart,
        getItemCountInTheCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
