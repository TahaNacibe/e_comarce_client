"use client"
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, CreditCard, Truck } from "lucide-react";
import { CartContext } from "./context/cartContext";
import OrderServices from "../services/order-services/order_services";
import { useSession } from "next-auth/react";
import { UserDetails, AlertState, CartItem } from "./types";
import MobileFriendlyProductsDisplay from "./components/small_display_table";
import WideScreenProductsTable from "./components/wide_display_table";
import { useToast } from "@/hooks/use-toast";

// Proper type definitions

const UserCartPage: React.FC = () => {
  const cartContext = useContext(CartContext);
  
  if (!cartContext) {
    throw new Error("Cart context must be used within CartContextProvider");
  }

  const { cartItems, addOrUpdateCartItem, removeCartItem } = cartContext;

  const [userDetails, setUserDetails] = useState<UserDetails>(() => {
      return {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        houseNumber: "",
        city: "",
        zipCode: ""
      };
  });
  
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [alertState, setAlertState] = useState<AlertState>({ 
    message: "", 
    type: "" 
  });

  const orderServices = new OrderServices()
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleQuantityChange = (item: CartItem, delta: number): void => {
    const newQuantity = item.quantity + delta;
    if (newQuantity === 0) {
      removeCartItem(item.productId, item.selectedProperties as any);
    } else {
      addOrUpdateCartItem({
        ...item,
        quantity: delta
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UserDetails
  ): void => {
    const value = e.target.value;
    setUserDetails(prev => {
      const newDetails = { ...prev, [field]: value };
      if (typeof window !== "undefined") {
        localStorage.setItem("userDetails", JSON.stringify(newDetails));
      }
      return newDetails;
    });

    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    const zipRegex = /^\d{5}(-\d{4})?$/;

    if (!userDetails.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!userDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(userDetails.phone)) {
      newErrors.phone = "Invalid phone format";
    }
    if (!userDetails.address.trim()) newErrors.address = "Address is required";
    if (!userDetails.city.trim()) newErrors.city = "City is required";
    if (!userDetails.houseNumber.trim()) newErrors.houseNumber = "House number is required";
    if (!userDetails.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!zipRegex.test(userDetails.zipCode)) {
      newErrors.zipCode = "Invalid ZIP code format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => 
      total + parseFloat(item.totalPrice) * item.quantity, 0
    );
  };


  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast({
        className:"bg-orange-800 text-white",
        description: "Your cart is empty",
        title: "Can't sent order!"
      });
      return;
    }

    if (validateForm()) {
      const response = await orderServices.createOrderForUser(userDetails, cartItems, calculateSubtotal(), session?.user.id)
      if (response.success) {
        cartContext.clearCart();
      }
      toast({
        className:`${response.success? "bg-blue-800" : "bg-red-800"} text-white`,
        title: response.success ? "Order was placed" : "Could'nt sent order",
        description: response.success? "we will call to confirm later": response.message
      })
    } else {
      toast({
        variant:"destructive",
        description: "Please fix the form errors before submitting",
        title: "Can't send order!"
      });
    }

  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Cart Items ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mb-4" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                  <div>
                    <div className="hidden md:block w-full">
                    <WideScreenProductsTable
                      cartItems={cartItems}
                      handleQuantityChange={(item: CartItem, newQuantity: number) => handleQuantityChange(item, newQuantity)}
                      removeCartItem={(id: string, properties: any) => removeCartItem(id,properties)} />
                    </div>
                    <MobileFriendlyProductsDisplay
                      cartItems={cartItems}
                      handleQuantityChange={(item: CartItem, newQuantity: number) => handleQuantityChange(item, newQuantity)}
                      removeCartItem={(id: string, properties: any) => removeCartItem(id,properties)} />
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {cartItems.length > 0 && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{calculateSubtotal().toFixed(2)}Dzd</span>
                    </div>
                    
                   
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                          {(
                            calculateSubtotal()
                          ).toFixed(2)}Dzd
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 pt-6">
                {[
                  { label: "Full Name", field: "fullName" },
                  { label: "Email", field: "email" },
                  { label: "Phone", field: "phone" },
                  { label: "House number", field: "houseNumber" },
                  { label: "Address", field: "address" },
                  { label: "City", field: "city" },
                  { label: "ZIP Code", field: "zipCode" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1">
                      {label}
                    </label>
                    <Input
                      type={field === "email" ? "email" : field === "houseNumber"? "number" : "text"}
                      value={userDetails[field as keyof UserDetails]}
                      onChange={(e) => handleInputChange(e, field as keyof UserDetails)}
                      className={errors[field as keyof UserDetails] ? "border-red-500" : ""}
                    />
                    {errors[field as keyof UserDetails] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field as keyof UserDetails]}
                      </p>
                    )}
                  </div>
                ))}
              </form>
            </CardContent>
          </Card>

          <Button 
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={cartItems.length === 0}
          >
            Place Order
          </Button>
        </div>
      </div>

      {alertState.message && (
        <Alert 
          variant={alertState.type === "error" ? "destructive" : "default"}
          className="mt-6"
        >
          <AlertDescription>{alertState.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UserCartPage;