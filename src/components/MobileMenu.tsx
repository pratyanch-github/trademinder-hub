
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { X, Home, Package, ShoppingBag, Settings, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const MobileMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <div className="h-full flex flex-col overflow-y-auto pb-16">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">ElegantMart</span>
        </div>
        <Button variant="ghost" size="icon" asChild className="SheetClose">
          <div>
            <X className="h-5 w-5" />
          </div>
        </Button>
      </div>
      
      <div className="p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search products..." />
        </div>
        
        <nav className="space-y-3">
          <Link to="/" className="flex items-center px-3 py-2 rounded-md hover:bg-muted">
            <Home className="mr-3 h-5 w-5" />
            Home
          </Link>
          <Link to="/products" className="flex items-center px-3 py-2 rounded-md hover:bg-muted">
            <ShoppingBag className="mr-3 h-5 w-5" />
            Products
          </Link>
          <Link to="/cart" className="flex items-center px-3 py-2 rounded-md hover:bg-muted">
            <ShoppingBag className="mr-3 h-5 w-5" />
            Cart
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" className="flex items-center px-3 py-2 rounded-md hover:bg-muted">
                <Package className="mr-3 h-5 w-5" />
                My Orders
              </Link>
              <Link to="/account" className="flex items-center px-3 py-2 rounded-md hover:bg-muted">
                <User className="mr-3 h-5 w-5" />
                My Account
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="flex items-center px-3 py-2 rounded-md hover:bg-muted">
              <Settings className="mr-3 h-5 w-5" />
              Admin Dashboard
            </Link>
          )}
        </nav>
        
        <Separator className="my-6" />
        
        {isAuthenticated ? (
          <div>
            <div className="mb-4">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full">Log in</Button>
            </Link>
            <Link to="/register" className="block">
              <Button className="w-full">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
