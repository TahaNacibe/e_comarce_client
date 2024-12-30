"use client"
import { createContext, ReactNode, useEffect, useState } from "react";

// Define the shape of a cart item
interface CartItem {
  productId: string, productName: string, quantity: number, selectedProperties: string[],totalPrice:string,productImage:string
}

// Define the shape of the context state
interface CartContextType {
  cartItems: CartItem[];
  addOrUpdateCartItem: (item: CartItem) => void;
  removeCartItem: (productId: string, selectedProperties: Record<string, string>) => void;
  getCartItemQuantity: (productId: string, selectedProperties: Record<string, string>) => number;
  isProductWithPropertiesInTheCart:(item:CartItem) => boolean
  clearCart: () => void;
}

// Define the shape of the provider's props
interface CartContextProviderProps {
  children: ReactNode;
}

// Create context with an initial value (use `null` and handle it in the consumer for safety)
export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

    //* Load cart from localStorage on mount
    useEffect(() => {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }, []);
  
    //* Save cart to localStorage whenever it changes
    useEffect(() => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

  //* check if item already exist
  function isProductWithPropertiesInTheCart(item: CartItem): boolean {
    const itemIndex = cartItems.findIndex((product) => 
      product.productId === item.productId &&
      JSON.stringify(product.selectedProperties) === JSON.stringify(item.selectedProperties)
    );
  
    return itemIndex !== -1;
  }

  //* Add or update a cart item
  function addOrUpdateCartItem(item: CartItem): void {
    let hasRun = false; // Track whether this function has already been executed
    console.log("updated item : ", item);
  
    setCartItems((prev) => {
      if (hasRun) return prev; // Prevent duplicate execution
      hasRun = true;
  
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          JSON.stringify(i.selectedProperties) === JSON.stringify(item.selectedProperties)
      );
  
      if (existingIndex !== -1) {
        console.log("update case");
        const updatedCart = [...prev];
        updatedCart[existingIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        console.log("create case");
        return [...prev, item];
      }
    });
  }
  

  //* Remove a specific cart item
  function removeCartItem(productId: string, selectedProperties: Record<string, string>): void {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.productId !== productId ||
          JSON.stringify(item.selectedProperties) !== JSON.stringify(selectedProperties)
      )
    );
  }

  //* Get the quantity of a specific item in the cart
  function getCartItemQuantity(productId: string, selectedProperties: Record<string, string>): number {
    const item = cartItems.find(
      (i) =>
        i.productId === productId &&
        JSON.stringify(i.selectedProperties) === JSON.stringify(selectedProperties)
    );
    return item ? item.quantity : 0;
  }

  //* Clear the entire cart
  function clearCart(): void {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  }

  //* Return the provider with the context value
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addOrUpdateCartItem,
        removeCartItem,
        getCartItemQuantity,
        isProductWithPropertiesInTheCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
