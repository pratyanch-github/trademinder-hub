
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  MapPin,
  Truck,
  ChevronLeft,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Address, Order, OrderItem, OrderStatus } from "@/types";
import { orders } from "@/data/mockData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Step = "shipping" | "payment" | "review";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [upiPaymentStatus, setUpiPaymentStatus] = useState<string | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: user ? `${user.firstName} ${user.lastName}` : "",
    expiryDate: "",
    cvv: "",
  });
  
  const [upiDetails, setUpiDetails] = useState({
    upiId: "",
  });
  
  // Calculate totals
  const shipping = cart.subtotal > 50 ? 0 : 5.99;
  const tax = cart.subtotal * 0.07;
  const total = cart.subtotal + shipping + tax;
  
  // Form validation
  const isShippingValid = () => {
    return (
      shippingAddress.fullName &&
      shippingAddress.line1 &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.postalCode &&
      shippingAddress.country &&
      shippingAddress.phone
    );
  };
  
  const isPaymentValid = () => {
    if (paymentMethod === "credit_card") {
      return (
        cardDetails.cardNumber.length >= 16 &&
        cardDetails.cardHolder &&
        cardDetails.expiryDate &&
        cardDetails.cvv.length >= 3
      );
    } else if (paymentMethod === "upi") {
      return upiDetails.upiId.includes('@');
    }
    return true;
  };
  
  const handleNext = () => {
    if (currentStep === "shipping") {
      if (!isShippingValid()) {
        toast.error("Please fill in all required shipping fields");
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      if (!isPaymentValid()) {
        toast.error("Please fill in all required payment fields");
        return;
      }
      
      // Simulate UPI payment notification initiation
      if (paymentMethod === "upi" && upiDetails.upiId) {
        setUpiPaymentStatus("pending");
        setTimeout(() => {
          setUpiPaymentStatus("success");
          toast.success(`UPI payment request sent to ${upiDetails.upiId}`);
        }, 1500);
      }
      
      setCurrentStep("review");
    }
  };
  
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };
  
  const handlePlaceOrder = () => {
    if (user) {
      // Create a new order
      const orderItems: OrderItem[] = cart.items.map(item => ({
        id: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const newOrder: Order = {
        id: `order_${Date.now()}`,
        userId: user.id,
        items: orderItems,
        total: total,
        status: "processing" as OrderStatus,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod === "credit_card" ? "Credit Card" : 
                      paymentMethod === "upi" ? "UPI" : "PayPal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mock data
      orders.unshift(newOrder);
      
      // Show success message
      toast.success("Order placed successfully!");
      
      // Clear cart and navigate to confirmation
      clearCart();
      navigate("/order-confirmation");
    }
  };
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  if (cart.items.length === 0) {
    navigate("/cart");
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                currentStep === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
                1
              </div>
              <div className={`h-1 w-24 ${
                currentStep === "shipping" ? "bg-muted" : "bg-primary"
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                currentStep === "payment" ? "bg-primary text-primary-foreground" : 
                currentStep === "review" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground"
              }`}>
                2
              </div>
              <div className={`h-1 w-24 ${
                currentStep === "review" ? "bg-primary" : "bg-muted"
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                currentStep === "review" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                3
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-center w-24 mr-24">
              <span className={currentStep === "shipping" ? "font-medium" : "text-muted-foreground"}>
                Shipping
              </span>
            </div>
            <div className="text-center w-24 mr-24">
              <span className={currentStep === "payment" ? "font-medium" : "text-muted-foreground"}>
                Payment
              </span>
            </div>
            <div className="text-center w-24">
              <span className={currentStep === "review" ? "font-medium" : "text-muted-foreground"}>
                Review
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                {currentStep === "shipping" && (
                  <>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                      <CardDescription>
                        Enter your shipping address details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={shippingAddress.fullName}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  fullName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="line1">Address Line 1</Label>
                          <Input
                            id="line1"
                            value={shippingAddress.line1}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line1: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                          <Input
                            id="line2"
                            value={shippingAddress.line2 || ""}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line2: e.target.value,
                              })
                            }
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={shippingAddress.city}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  city: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={shippingAddress.state}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  state: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              value={shippingAddress.postalCode}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  postalCode: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                              value={shippingAddress.country}
                              onValueChange={(value) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  country: value,
                                })
                              }
                            >
                              <SelectTrigger id="country">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
                
                {currentStep === "payment" && (
                  <>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Payment Method
                      </CardTitle>
                      <CardDescription>
                        Select your preferred payment method
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value="credit_card" id="credit_card" />
                            <Label htmlFor="credit_card" className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Credit/Debit Card
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="flex items-center">
                              <Smartphone className="mr-2 h-4 w-4" />
                              UPI Payment
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal">PayPal</Label>
                          </div>
                        </RadioGroup>
                        
                        {paymentMethod === "credit_card" && (
                          <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={cardDetails.cardNumber}
                                onChange={(e) =>
                                  setCardDetails({
                                    ...cardDetails,
                                    cardNumber: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="cardHolder">Card Holder Name</Label>
                              <Input
                                id="cardHolder"
                                placeholder="John Doe"
                                value={cardDetails.cardHolder}
                                onChange={(e) =>
                                  setCardDetails({
                                    ...cardDetails,
                                    cardHolder: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  placeholder="MM/YY"
                                  value={cardDetails.expiryDate}
                                  onChange={(e) =>
                                    setCardDetails({
                                      ...cardDetails,
                                      expiryDate: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  value={cardDetails.cvv}
                                  onChange={(e) =>
                                    setCardDetails({
                                      ...cardDetails,
                                      cvv: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {paymentMethod === "upi" && (
                          <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="upiId">UPI ID</Label>
                              <Input
                                id="upiId"
                                placeholder="name@upi"
                                value={upiDetails.upiId}
                                onChange={(e) =>
                                  setUpiDetails({
                                    ...upiDetails,
                                    upiId: e.target.value,
                                  })
                                }
                                required
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Enter your UPI ID in the format username@bankname
                              </p>
                            </div>
                            
                            <Alert className="bg-amber-50 border-amber-200">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertTitle className="text-amber-800">UPI Payment Information</AlertTitle>
                              <AlertDescription className="text-amber-700">
                                When you proceed to the next step, a payment request will be initiated to your UPI ID.
                                You'll need to approve this payment in your UPI app.
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                        
                        {paymentMethod === "paypal" && (
                          <div className="mt-6 p-4 bg-muted/20 rounded-md text-center">
                            <p className="mb-2">
                              You'll be redirected to PayPal to complete your payment.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Note: This is a demo application. No actual payment will be processed.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </>
                )}
                
                {currentStep === "review" && (
                  <>
                    <CardHeader>
                      <CardTitle>Review Your Order</CardTitle>
                      <CardDescription>
                        Please review your order details before placing your order
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* UPI Payment Status Banner */}
                        {paymentMethod === "upi" && upiPaymentStatus && (
                          <Alert className={
                            upiPaymentStatus === "pending" 
                              ? "bg-blue-50 border-blue-200" 
                              : "bg-green-50 border-green-200"
                          }>
                            <AlertCircle className={
                              upiPaymentStatus === "pending"
                                ? "h-4 w-4 text-blue-600"
                                : "h-4 w-4 text-green-600"
                            } />
                            <AlertTitle className={
                              upiPaymentStatus === "pending"
                                ? "text-blue-800"
                                : "text-green-800"
                            }>
                              {upiPaymentStatus === "pending" 
                                ? "UPI Payment Request Initiated" 
                                : "UPI Payment Request Sent"}
                            </AlertTitle>
                            <AlertDescription className={
                              upiPaymentStatus === "pending"
                                ? "text-blue-700"
                                : "text-green-700"
                            }>
                              {upiPaymentStatus === "pending" 
                                ? `Sending payment request to ${upiDetails.upiId}...` 
                                : `Payment request sent to ${upiDetails.upiId}. Please check your UPI app to approve the payment.`}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div>
                          <h3 className="font-medium mb-3">Shipping Address</h3>
                          <div className="bg-muted/20 p-4 rounded-md">
                            <p>{shippingAddress.fullName}</p>
                            <p>{shippingAddress.line1}</p>
                            {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                            <p>
                              {shippingAddress.city}, {shippingAddress.state}{" "}
                              {shippingAddress.postalCode}
                            </p>
                            <p>{shippingAddress.country}</p>
                            <p>{shippingAddress.phone}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => setCurrentStep("shipping")}
                          >
                            Edit
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-3">Payment Method</h3>
                          <div className="bg-muted/20 p-4 rounded-md">
                            {paymentMethod === "credit_card" ? (
                              <div>
                                <div className="flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  <span>Credit Card</span>
                                </div>
                                <p className="mt-2">
                                  **** **** **** {cardDetails.cardNumber.slice(-4)}
                                </p>
                                <p>{cardDetails.cardHolder}</p>
                              </div>
                            ) : paymentMethod === "upi" ? (
                              <div className="flex items-center">
                                <Smartphone className="h-4 w-4 mr-2" />
                                <span>UPI: {upiDetails.upiId}</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span>PayPal</span>
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => setCurrentStep("payment")}
                          >
                            Edit
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-3">Order Items</h3>
                          <div className="space-y-4">
                            {cart.items.map((item) => (
                              <div key={item.id} className="flex items-center">
                                <div className="w-12 h-12 bg-muted/30 rounded overflow-hidden mr-4">
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{item.product.name}</span>
                                    <span className="font-medium">
                                      ${(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
                
                <CardFooter className="flex justify-between">
                  {currentStep !== "shipping" ? (
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => navigate("/cart")}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Button>
                  )}
                  
                  {currentStep !== "review" ? (
                    <Button onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={paymentMethod === "upi" && upiPaymentStatus === "pending"}
                    >
                      Place Order
                    </Button>
                  )}
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
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-3 text-sm">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
