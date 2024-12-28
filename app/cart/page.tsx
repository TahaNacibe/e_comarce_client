import React, { useEffect, useState } from "react";

interface CartProduct {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  quantity: number;
}

interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

const UserCartPage: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const savedUserDetails = localStorage.getItem("userDetails");
    if (savedUserDetails) {
      setUserDetails(JSON.parse(savedUserDetails));
    }
    // Mock cart data
    const mockCartProducts: CartProduct[] = [
      {
        id: 1,
        name: "Product A",
        price: 100,
        discountedPrice: 80,
        image: "https://via.placeholder.com/150",
        quantity: 2,
      },
      {
        id: 2,
        name: "Product B",
        price: 50,
        image: "https://via.placeholder.com/150",
        quantity: 1,
      },
    ];
    setCartProducts(mockCartProducts);
  }, []);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UserDetails
  ) => {
    const value = e.target.value;
    setUserDetails((prev) => ({ ...prev, [field]: value }));
    localStorage.setItem(
      "userDetails",
      JSON.stringify({ ...userDetails, [field]: value })
    );
  };

  const validateForm = () => {
    const newErrors: Partial<UserDetails> = {};
    if (!userDetails.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!userDetails.email.trim()) newErrors.email = "Email is required";
    if (!userDetails.phone.trim()) newErrors.phone = "Phone number is required";
    if (!userDetails.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setAlertMessage("Order placed successfully!");
      setTimeout(() => setAlertMessage(""), 3000);
    } else {
      setAlertMessage("Please fix the errors before submitting.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const calculateTotalPrice = () => {
    return cartProducts.reduce(
      (total, product) =>
        total + (product.discountedPrice ?? product.price) * product.quantity,
      0
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Product</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {cartProducts.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 p-2 flex items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  {product.name}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  ${
                    ((product.discountedPrice ?? product.price) *
                    product.quantity).toFixed(2)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <form className="space-y-4">
        {[
          { label: "Full Name", field: "fullName" },
          { label: "Email", field: "email" },
          { label: "Phone", field: "phone" },
          { label: "Address", field: "address" },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block font-medium mb-1">
              {label}
              <input
                type="text"
                value={userDetails[field as keyof UserDetails]}
                onChange={(e) =>
                  handleInputChange(e, field as keyof UserDetails)
                }
                className="block w-full border border-gray-300 p-2 rounded"
              />
            </label>
            {errors[field as keyof UserDetails] && (
              <p className="text-red-500 text-sm">
                {errors[field as keyof UserDetails]}
              </p>
            )}
          </div>
        ))}
      </form>

      <h2 className="text-xl font-bold my-4">Order Summary</h2>
      <p className="text-lg font-medium mb-4">
        Total: ${calculateTotalPrice().toFixed(2)}
      </p>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Place Order
      </button>

      {alertMessage && (
        <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 text-yellow-700">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default UserCartPage;
