
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { Product, Review } from "@/types";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/ProductCard";
import { 
  ShoppingCart, 
  Check, 
  Minus, 
  Plus, 
  Star, 
  Truck, 
  RefreshCw,
  ShieldCheck, 
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart, isInCart, cart, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Find cart item if it exists
  const cartItem = cart.items.find(item => item.productId === productId);
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]);
        
        // Set related products from the same category
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }, 500);
  }, [productId]);
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
    
    // Update cart if item already exists
    if (cartItem) {
      updateQuantity(cartItem.id, value);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you are looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Format the product's average rating
  const averageRating = product.rating || 0;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
            <li className="text-muted-foreground">/</li>
            <li><Link to="/products" className="text-muted-foreground hover:text-foreground">Products</Link></li>
            <li className="text-muted-foreground">/</li>
            <li><Link to={`/products?category=${product.category}`} className="text-muted-foreground hover:text-foreground">{product.category}</Link></li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium truncate">{product.name}</li>
          </ol>
        </nav>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === image 
                        ? "border-primary" 
                        : "border-transparent hover:border-muted"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <div className="mb-auto">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= averageRating 
                          ? "text-yellow-500 fill-current" 
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</h2>
              
              <div className="prose prose-sm max-w-none mb-8">
                <p>{product.description}</p>
              </div>
              
              <Separator className="my-6" />
              
              {/* Quantity and Add to Cart */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-l-md rounded-r-none"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="h-10 px-4 flex items-center justify-center border-y">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-r-md rounded-l-none"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={product.stock <= quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} available
                  </span>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <Button
                className="w-full mb-4"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {isInCart(product.id) ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Already in Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              {/* Product Highlights */}
              <div className="space-y-3 mt-8">
                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm">
                  <RefreshCw className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>30 day return policy</span>
                </div>
                <div className="flex items-center text-sm">
                  <ShieldCheck className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>2 year warranty</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Ships within 24 hours</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviews?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-6 bg-muted/20 rounded-lg">
              <div className="prose max-w-none">
                <p>{product.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                  auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis
                  aliquam nisl nunc eget nisl. Nullam auctor, nisl eget ultricies
                  aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eget nisl.
                </p>
                <p>
                  Nulla facilisi. Sed euismod, nisl eget ultricies aliquam, nunc nisl
                  aliquet nunc, quis aliquam nisl nunc eget nisl. Nullam auctor, nisl
                  eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl
                  nunc eget nisl.
                </p>
                <h3>Key Features</h3>
                <ul>
                  <li>High-quality materials</li>
                  <li>Durable construction</li>
                  <li>Sleek and modern design</li>
                  <li>Versatile functionality</li>
                  <li>Easy maintenance</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-6 bg-muted/20 rounded-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Product Specifications</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Model</span>
                        <span>XYZ-{product.id}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Material</span>
                        <span>Premium Quality</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Dimensions</span>
                        <span>12 x 8 x 3 inches</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Weight</span>
                        <span>2.5 lbs</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Color</span>
                        <span>Multiple options</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Package Contents</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Main Unit</span>
                        <span>1x {product.name}</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Accessories</span>
                        <span>Standard accessories</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Manual</span>
                        <span>User guide & warranty</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Warranty</span>
                        <span>2 years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6 bg-muted/20 rounded-lg">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-4xl font-bold">
                      {averageRating.toFixed(1)}
                    </div>
                    <div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= averageRating
                                ? "text-yellow-500 fill-current"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Based on {product.reviews.length} reviews
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {product.reviews.map((review: Review) => (
                    <div key={review.id} className="py-4 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to review this product
                  </p>
                  <Button variant="outline">Write a Review</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
