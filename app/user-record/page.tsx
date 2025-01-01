"use client";
import { signIn, useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Orders } from '@prisma/client';
import OrderServices from '../services/order-services/order_services';
import LoadingWidget from '../components/loading_widget';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmActionDialog } from '../components/dialog/confirmActionDialog';

const ProfilePage = () => {
  const orderServices = new OrderServices();
  const { data: session, status } = useSession();
  const [userOrders, setUserOrders] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);  // For displaying order details

  useEffect(() => {
    const getTheOrdersData = async () => {
      if (session?.user?.email) {
        try {
          const response = await orderServices.getUserOrdersHistory(session.user.id);
          if (response.success) {
            setUserOrders(response.data);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setIsLoading(false);
        }
      }
    };

    if (session && status === 'authenticated') {
      getTheOrdersData();
    }
  }, [session, status]);

  useEffect(() => {
    if (userOrders.length > 0) {
      const total = userOrders.reduce((sum, order) => sum + order.orderMetaData.totalPrice, 0);
      setTotalAmount(total);
    }
  }, [userOrders]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 text-green-700';
      case 'CANCELED':
        return 'bg-red-50 text-red-700';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getVerificationBadgeVariant = (verified: boolean) => {
    return verified
      ? 'bg-blue-50 text-blue-700'
      : 'bg-orange-50 text-orange-700';
  };

  const handleOrderClick = (order: Orders) => {
    setSelectedOrder(order);  // Show the details modal
  };

  if (status === 'loading') {
    return <LoadingWidget />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-sm text-center">
          <Image height={240} width={240} src="/log_in.svg" className="mx-auto mb-8" alt="Login illustration" />
          <h1 className="text-xl font-medium text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8">Sign in to view your profile</p>
          <button
            onClick={() => signIn("google")}
            className="w-full bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingWidget />;
  }

  const NoOrder = () => (
    <div className="text-center py-12">
      <Image 
        alt="No orders found"
        width={180}
        height={180}
        src="/404_error.svg"
        className="mx-auto mb-4"
      />
      <p className="text-gray-500 text-sm">No orders found</p>
    </div>
  );

  const StatCard = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-12 flex-row">
          <div className="flex items-center">
            {session.user.image && (
              <Image 
                width={48} 
                height={48} 
                src={session.user.image} 
                alt="Profile Picture" 
                className="rounded-full"
              />
            )}
            <div className="ml-4">
              <h1 className="text-xl font-medium text-gray-900">{session.user.name}</h1>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
          <ConfirmActionDialog title={'Log out?'} description={'are you sure you want to log out'}
            action={() => signOut()} trigger={<Button
            variant={"destructive"}
            className="text-sm flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span className='md:block hidden'>Sign out</span>
          </Button>} />
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            label="Total Orders" 
            value={userOrders.length.toString()} 
          />
          <StatCard 
            label="Total Spent" 
            value={`$${totalAmount.toFixed(2)}`} 
          />
          <StatCard 
            label="Member Since" 
            value={format(new Date(userOrders[0]?.createdAt || new Date()), 'MMMM yyyy')} 
          />
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Order History</h2>
          
          {userOrders.length === 0 ? (
            <NoOrder />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Items</TableHead>
                    <TableHead className="text-xs">Total</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleOrderClick(order)}  // Trigger modal
                    >
                      <TableCell className="text-sm">{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-sm">{order.orderMetaData.productsMetaDataList.length}</TableCell>
                      <TableCell className="text-sm">{order.orderMetaData.totalPrice.toFixed(2)} DZD</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs ${getStatusBadgeVariant(order.status)}`}>
                          {order.status.toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs ${getVerificationBadgeVariant(order.verified)}`}>
                          {order.verified ? 'Verified' : 'Pending'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
{selectedOrder && (
  <Card className="m-4 p-6 shadow-lg rounded-lg">
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900">Order Details</h2>

      {/* Order Product Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-medium">Product Name</TableCell>
            <TableCell className="font-medium">Quantity</TableCell>
            <TableCell className="font-medium">Unit Price</TableCell>
            <TableCell className="font-medium">Selected With</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedOrder.orderMetaData.productsMetaDataList.map((productMetaData, index) => (
            <TableRow key={index}>
              <TableCell>{productMetaData.productName}</TableCell>
              <TableCell>{productMetaData.quantity}</TableCell>
              <TableCell>{productMetaData.unitePrice} DZD</TableCell>
              <TableCell className="flex gap-2">
                {productMetaData.selectedProperties.map((prop, propIndex) => (
                  <Badge key={propIndex} className=" px-2 py-1 rounded-md">
                    {JSON.parse(prop).value}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <Button onClick={() => setSelectedOrder(null)} className="bg-gray-600 text-white hover:bg-gray-700 rounded-lg px-6 py-2">
          Close
        </Button>
      </div>
    </div>
  </Card>
)}

      </div>
    </div>
  );
};

export default ProfilePage;
