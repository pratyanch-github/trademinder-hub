
import React, { createContext, useState, useContext, useEffect } from "react";
import { Cart, CartItem, Product } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0 });

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    const userId = user?.id || "guest";
    const storedCart = localStorage.getItem(`cart_${userId}`);
    
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart({ items: [], subtotal: 0 });
      }
    } else {
      setCart({ items: [], subtotal: 0 });
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const userId = user?.id || "guest";
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  }, [cart, user]);

  // Calculate subtotal whenever cart items change
  useEffect(() => {
    const newSubtotal = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    setCart(prev => ({ ...prev, subtotal: newSubtotal }));
  }, [cart.items]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
        
        toast.success(`Updated ${product.name} quantity in cart`);
        
        return {
          ...prevCart,
          items: newItems,
        };
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `cart_item_${Date.now()}`,
          productId: product.id,
          product,
          quantity,
        };
        
        toast.success(`Added ${product.name} to cart`);
        
        return {
          ...prevCart,
          items: [...prevCart.items, newItem],
        };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.items.find(item => item.id === itemId);
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.product.name} from cart`);
      }
      
      return {
        ...prevCart,
        items: newItems,
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      return {
        ...prevCart,
        items: newItems,
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], subtotal: 0 });
    toast.success("Cart cleared");
  };

  const isInCart = (productId: string) => {
    return cart.items.some(item => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
