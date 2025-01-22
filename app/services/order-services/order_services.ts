
  
type ValuesTypeForProperties = {
    value:  string
    changePrice:  boolean
    newPrice : string
  }

interface CreateNewOrderInterface {
    productId: string, productName: string, quantity: number, selectedProperties: string[],totalPrice:string,productImage:string
}


interface UserDetails {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    houseNumber: string;
    zipCode: string;
}
  
interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    selectedProperties: any[];
    totalPrice: string;
    productImage: string;
  }
  

export default class OrderServices {
    async getUserOrdersHistory(id: string) {
        try {
            //* check if id exist 
            if (!id) return { success: false, message: "no user found" }
            const response = await fetch(`/api/orders?userId=${id}`, {
                method:"GET"
            })

            if (response.ok) {
                const data = await response.json()
                return {success: true, message: "Record loaded",data: data.userOrdersRecord}
            }
            return {success: false, message: "failed to load" }
        } catch (error:any) {
            return { success: false, message: "error getting record" }
        }
    }


    //* create a new product data from user input
    createNewOrderProductMetaDataFromUserInput({productId,productName,quantity,selectedProperties,totalPrice,productImage}:CreateNewOrderInterface) {
        if (!productId || !productName || !quantity || !selectedProperties)
            return { success: false, message: "Failed to create order missing required data", data: null };
        //* other wise create product
        const productMetaData =  {
            productId,
            productProperties: [],
            selectedProperties: selectedProperties,
            productImage:productImage,
            productName,
            quantity,
            unitePrice: Number(totalPrice) / quantity,
            totalPrice
        }
        return { success: true, message: "Product created", data:productMetaData };
    }


    //* create order
    createOrderForUser = async (userDetails: UserDetails, items: CartItem[], totalPrice: number, userId?: string) => {
        try {
            const orderItem = {
            // User Information
            userId :userId ?? "" ,

            // Contact Details
            name: userDetails.fullName,
            email: userDetails.email,
            phoneNumber: userDetails.phone,

            // Address Information
            address:     userDetails.address,
            houseNumber: userDetails.houseNumber,
            city: userDetails.city,
            postalCode: userDetails.zipCode,

            // Order Details
            status:   "PENDING",
            verified: false,

                // Product Relations
                orderMetaData: {
                    productsMetaDataList: items.map((item) => (
                        {
                            productId: item.productId,
                            selectedProperties: item.selectedProperties.map((property) => JSON.stringify(property)),
                            productName: item.productName,
                            quantity: item.quantity,
                            unitePrice: Number(item.totalPrice) / item.quantity
                        }
                    )),
                    totalPrice:totalPrice,
                    currency: "DZD"
  }
            }

            const sendOrder = await fetch('/api/orders', {
                method: "POST",
                body:JSON.stringify(orderItem)
            })

            if (sendOrder.ok) {
                return {success:true, message:"order ws sent"}
            }
            return {success:false, message:"failed to send the order"}
        } catch (error) {
            return {success:false, message:"failed to send the order"}
        }
    }



    loadCitiesAndDeliveryFees = async () => { 
        try {
            const response = await fetch('/api/cities', {
                method: "GET"
            })
            if (response.ok) {
                const data = await response.json()
                return {success:true, message:"cities loaded", data:data.data}
            }
            return {success:false, message:"failed to load cities"}
        } catch (error) {
            return {success:false, message:"failed to load cities"}
        }
    }
}