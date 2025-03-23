
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { orders } from "@/data/mockData";
import { Order } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/order/OrderCard";
import EmptyOrdersState from "@/components/order/EmptyOrdersState";

const Orders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const fetchOrders = () => {
      if (user) {
        const userOrderList = orders.filter(order => order.userId === user.id);
        setUserOrders(userOrderList);
      }
    };
    
    fetchOrders();
  }, [user, isAuthenticated, navigate]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        
        {userOrders.length > 0 ? (
          <div>
            <Tabs defaultValue="all">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-6">
                  {userOrders.map((order, index) => (
                    <OrderCard key={order.id} order={order} index={index} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="processing">
                <div className="space-y-6">
                  {userOrders
                    .filter(order => order.status === "processing")
                    .map((order, index) => (
                      <OrderCard key={order.id} order={order} index={index} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="shipped">
                <div className="space-y-6">
                  {userOrders
                    .filter(order => order.status === "shipped")
                    .map((order, index) => (
                      <OrderCard key={order.id} order={order} index={index} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="delivered">
                <div className="space-y-6">
                  {userOrders
                    .filter(order => order.status === "delivered")
                    .map((order, index) => (
                      <OrderCard key={order.id} order={order} index={index} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <EmptyOrdersState />
        )}
      </div>
    </Layout>
  );
};

export default Orders;
