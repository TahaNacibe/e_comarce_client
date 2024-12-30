export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  selectedProperties: any[];
  totalPrice: string;
  productImage: string;
}

export interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  houseNumber: string;
  zipCode: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addOrUpdateCartItem: (item: CartItem) => void;
  removeCartItem: (productId: string, selectedProperties: any[]) => void;
  clearCart: () => void;
}

export interface AlertState {
  message: string;
  type: "success" | "error" | "";
}



export interface ProductsDisplayInterface {
    cartItems: CartItem[],
    handleQuantityChange: (item:CartItem,newQuantity: number) => void,
    removeCartItem:(is:string,properties:any) => void
}