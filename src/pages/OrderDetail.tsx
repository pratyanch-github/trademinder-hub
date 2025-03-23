
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { orders } from "@/data/mockData";
import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Package, Truck, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusColor, getOrderStatusIcon, getOrderStatusText } from "@/components/order/OrderCard";

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the order from the mock data
    const foundOrder = orders.find(o => o.id === orderId);
    setOrder(foundOrder || null);
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <p>Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="mb-6">We couldn't find the order you're looking for.</p>
            <Button asChild>
              <Link to="/orders">Go Back to Orders</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/orders">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.id}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge className={`mt-4 md:mt-0 ${getOrderStatusColor(order.status)}`}>
              <span className="flex items-center">
                {getOrderStatusIcon(order.status)}
                <span className="ml-1">{getOrderStatusText(order.status)}</span>
              </span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                <p><span className="font-medium">Order Total:</span> ${order.total.toFixed(2)}</p>
                {order.paymentMethod === "UPI" && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm">Payment processed through UPI</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {order.status === "processing" ? (
                        <Package className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Package className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Order Processing</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "processing" ? "In progress" : "Completed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {order.status === "shipped" || order.status === "delivered" ? (
                        <Truck className="h-5 w-5 text-green-500" />
                      ) : (
                        <Truck className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "shipped" || order.status === "delivered"
                          ? "Your order is on the way"
                          : "Waiting to be shipped"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {order.status === "delivered" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "delivered"
                          ? "Your order has been delivered"
                          : "Waiting to be delivered"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b last:border-0">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-muted/30 rounded overflow-hidden mr-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <Link to={`/products/${item.productId}`} className="font-medium hover:text-primary">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 ml-auto w-full sm:w-64">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    ${order.items
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {order.total -
                      order.items.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) >
                    0
                      ? `$${(
                          order.total -
                          order.items.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                        ).toFixed(2)}`
                      : "Free"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.status === "delivered" && (
            <div className="flex justify-center">
              <Button>Buy Again</Button>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
