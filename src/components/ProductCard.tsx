
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart, isInCart } = useCart();
  const alreadyInCart = isInCart(product.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="h-full overflow-hidden group border hover:shadow-md transition-all duration-300">
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-muted/10">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-white/90 text-black text-sm font-medium px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{product.category}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
                <span>{product.rating || 0}</span>
              </div>
            </div>
            
            <Link to={`/products/${product.id}`} className="block">
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            
            <div className="flex items-center justify-between">
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              
              <Button 
                variant={alreadyInCart ? "outline" : "default"}
                size="sm"
                className="h-8 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  if (!alreadyInCart) {
                    addToCart(product);
                  }
                }}
                disabled={product.stock <= 0}
              >
                {alreadyInCart ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    <span>Add</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
