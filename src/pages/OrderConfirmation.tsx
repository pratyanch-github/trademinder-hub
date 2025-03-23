
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
  
  React.useEffect(() => {
    // Redirect if accessed directly (not after checkout)
    const fromCheckout = sessionStorage.getItem("fromCheckout");
    if (!fromCheckout) {
      navigate("/");
    }
    
    return () => {
      sessionStorage.removeItem("fromCheckout");
    };
  }, [navigate]);
  
  // Simulate setting the flag when coming from checkout
  React.useEffect(() => {
    sessionStorage.setItem("fromCheckout", "true");
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your order has been received and is being processed. We've sent a confirmation email with your order details.
          </p>
          
          <div className="bg-muted/20 rounded-lg p-8 mb-8">
            <div className="text-left max-w-md mx-auto space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery:</span>
                <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>Credit Card</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-lg border text-center"
            >
              <Clock className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                Your order is being prepared for shipping
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-lg border text-center"
            >
              <Package className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Track Your Order</h3>
              <p className="text-sm text-muted-foreground">
                You will receive tracking information via email
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-lg border text-center"
            >
              <ShoppingBag className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Our customer service team is here to assist you
              </p>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/orders">
              <Button variant="outline">View Your Orders</Button>
            </Link>
            <Link to="/products">
              <Button>
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
