
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { orders } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Badge,
  Separator
} from "@/components/ui/badge";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  ChevronRight, 
  ShoppingBag 
} from "lucide-react";
import { motion } from "framer-motion";
import { Order, OrderStatus } from "@/types";

const Orders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Fetch user orders
    const fetchOrders = () => {
      if (user) {
        // Filter orders by user ID
        const userOrderList = orders.filter(order => order.userId === user.id);
        setUserOrders(userOrderList);
      }
    };
    
    fetchOrders();
  }, [user, isAuthenticated, navigate]);
  
  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Order Received";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };
  
  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
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
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild size="lg">
              <Link to="/products">
                Browse Products
                <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

interface OrderCardProps {
  order: Order;
  index: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, index }) => {
  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Order Received";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-base font-medium">
                Order #{order.id}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center">
              <Badge className={getOrderStatusColor(order.status)}>
                <span className="flex items-center">
                  {getOrderStatusIcon(order.status)}
                  <span className="ml-1">{getOrderStatusText(order.status)}</span>
                </span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Order Items */}
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="w-16 h-16 bg-muted/30 rounded overflow-hidden mr-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${item.productId}`}
                      className="font-medium hover:text-primary line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      Qty: {item.quantity} x ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            {/* Order Summary */}
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Shipping Address</div>
                <div>
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.line1}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:text-right">
                <div className="text-sm text-muted-foreground mb-1">Order Total</div>
                <div className="text-lg font-semibold">${order.total.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" asChild>
                <Link to={`/order-detail/${order.id}`}>
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              {order.status === "delivered" && (
                <Button variant="ghost">
                  Buy Again
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Orders;
