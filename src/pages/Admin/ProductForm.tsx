
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";
import { products, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ImagePlus, 
  Trash, 
  ChevronLeft, 
  Save,
  Loader2,
  X
} from "lucide-react";
import { toast } from "sonner";

const ProductForm: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isEditMode = productId !== "new";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    images: [],
    category: categories[0],
    stock: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  // Prevent non-admin users from accessing this page
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  useEffect(() => {
    if (isEditMode) {
      const productToEdit = products.find(p => p.id === productId);
      if (productToEdit) {
        setProduct(productToEdit);
      } else {
        // Product not found, redirect to product list
        navigate("/admin/products");
        toast.error("Product not found");
      }
    }
  }, [productId, isEditMode, navigate]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, this would upload to a server and get a URL back
      // For this demo, we'll just use a fake URL
      const newImageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?q=80&w=800`;
      
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl],
      }));
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!product.name || !product.description || product.price <= 0 || product.images.length === 0) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would make an API call
    setTimeout(() => {
      if (isEditMode) {
        toast.success("Product updated successfully!");
      } else {
        toast.success("Product created successfully!");
      }
      setIsSubmitting(false);
      navigate("/admin/products");
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/admin/products")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Product Info */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={product.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          value={product.stock}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={product.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label>Product Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group aspect-square bg-muted/30 rounded-md overflow-hidden">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md hover:bg-muted/10 cursor-pointer">
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Upload at least one product image. Recommended size: 800x800px.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Product Status</h3>
                  <Select
                    value={product.stock > 0 ? "in_stock" : "out_of_stock"}
                    onValueChange={(value) => 
                      setProduct(prev => ({
                        ...prev,
                        stock: value === "in_stock" ? (prev.stock || 1) : 0,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Separator className="my-4" />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? "Update Product" : "Create Product"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              
              {isEditMode && (
                <Card className="border-destructive">
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-destructive mb-4">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete this product. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      type="button"
                      className="w-full"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this product?")) {
                          // In a real app, this would make an API call
                          toast.success("Product deleted successfully!");
                          navigate("/admin/products");
                        }
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Product
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProductForm;
