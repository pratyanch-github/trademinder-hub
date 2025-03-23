
import React from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyOrdersState: React.FC = () => {
  return (
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
  );
};

export default EmptyOrdersState;
