
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const shipping = cart.subtotal > 50 || cart.items.length === 0 ? 0 : 5.99;
  const tax = cart.subtotal * 0.07;
  const total = cart.subtotal + shipping + tax;
  
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast("Please log in to continue", {
        description: "You need to be logged in to proceed with checkout",
        action: {
          label: "Log in",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }
    
    navigate("/checkout");
  };
  
  const handlePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Invalid promo code", {
      description: "The promo code you entered is invalid or has expired.",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Cart Items ({cart.items.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {cart.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className={`flex flex-col sm:flex-row gap-4 ${
                            index < cart.items.length - 1 ? "pb-6 border-b" : ""
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {/* Product Image */}
                          <Link 
                            to={`/products/${item.productId}`}
                            className="shrink-0 w-full sm:w-24 h-24 bg-muted/30 rounded overflow-hidden"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </Link>
                          
                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <Link 
                                to={`/products/${item.productId}`}
                                className="font-medium hover:text-primary"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-right font-semibold">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">
                              {item.product.category}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-md rounded-r-none"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <div className="h-8 px-3 flex items-center justify-center text-sm border-y">
                                  {item.quantity}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-md rounded-l-none"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="text-sm" 
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                    <Link to="/products">
                      <Button variant="ghost" className="text-sm">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
            
            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${cart.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>
                          {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (7%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      
                      <form onSubmit={handlePromoCode} className="pt-4">
                        <div className="flex space-x-2">
                          <Input placeholder="Promo code" />
                          <Button type="submit" variant="outline">
                            Apply
                          </Button>
                        </div>
                      </form>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleCheckout}
                      disabled={cart.items.length === 0}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </Button>
                    
                    <div className="w-full space-y-3 text-sm">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>30-day returns</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love.
            </p>
            <Button asChild size="lg">
              <Link to="/products">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
