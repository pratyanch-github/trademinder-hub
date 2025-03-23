
import { Product, User, Order, OrderStatus, Review } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "user1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "user2",
    email: "customer@example.com",
    firstName: "Customer",
    lastName: "User",
    role: "customer",
    createdAt: "2023-01-02T00:00:00Z",
  },
];

// Mock Product Reviews
const reviews: Review[] = [
  {
    id: "review1",
    userId: "user2",
    userName: "Customer User",
    rating: 4,
    comment: "Great product, very happy with my purchase!",
    createdAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "review2",
    userId: "user3",
    userName: "Jane Doe",
    rating: 5,
    comment: "Exceeded my expectations. Highly recommended!",
    createdAt: "2023-02-02T00:00:00Z",
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: "product1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear sound with our premium noise-cancelling wireless headphones. Perfect for music lovers and professionals.",
    price: 299.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
      "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1000",
    ],
    category: "Electronics",
    stock: 50,
    rating: 4.5,
    reviews: reviews,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "product2",
    name: "Smart Watch Series X",
    description: "Stay connected and track your fitness with our latest smart watch. Features include heart rate monitoring, sleep tracking, and more.",
    price: 349.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=989",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1064",
    ],
    category: "Electronics",
    stock: 30,
    rating: 4.7,
    reviews: [],
    createdAt: "2023-01-16T00:00:00Z",
    updatedAt: "2023-01-16T00:00:00Z",
  },
  {
    id: "product3",
    name: "Ultra HD 4K Smart TV",
    description: "Transform your home entertainment with our Ultra HD 4K Smart TV. Experience stunning visuals and smart connectivity.",
    price: 999.99,
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1470",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=1633",
    ],
    category: "Electronics",
    stock: 15,
    rating: 4.8,
    reviews: [],
    createdAt: "2023-01-17T00:00:00Z",
    updatedAt: "2023-01-17T00:00:00Z",
  },
  {
    id: "product4",
    name: "Professional Camera Kit",
    description: "Capture life's moments with precision using our professional camera kit. Includes multiple lenses and accessories.",
    price: 1299.99,
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1470",
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=1470",
    ],
    category: "Electronics",
    stock: 10,
    rating: 4.9,
    reviews: [],
    createdAt: "2023-01-18T00:00:00Z",
    updatedAt: "2023-01-18T00:00:00Z",
  },
  {
    id: "product5",
    name: "Designer Leather Bag",
    description: "Elevate your style with our handcrafted designer leather bag. Combines elegance with functionality.",
    price: 499.99,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1335",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=987",
    ],
    category: "Fashion",
    stock: 25,
    rating: 4.6,
    reviews: [],
    createdAt: "2023-01-19T00:00:00Z",
    updatedAt: "2023-01-19T00:00:00Z",
  },
  {
    id: "product6",
    name: "Luxury Fountain Pen",
    description: "Write with elegance using our luxury fountain pen. Perfect for professionals and collectors alike.",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54712?q=80&w=1025",
      "https://images.unsplash.com/photo-1518644730709-0835105d9dae?q=80&w=1170",
    ],
    category: "Office",
    stock: 40,
    rating: 4.4,
    reviews: [],
    createdAt: "2023-01-20T00:00:00Z",
    updatedAt: "2023-01-20T00:00:00Z",
  },
];

// Mock Orders
export const orders: Order[] = [
  {
    id: "order1",
    userId: "user2",
    items: [
      {
        id: "orderItem1",
        productId: "product1",
        product: products[0],
        quantity: 1,
        price: products[0].price,
      },
      {
        id: "orderItem2",
        productId: "product2",
        product: products[1],
        quantity: 1,
        price: products[1].price,
      },
    ],
    total: products[0].price + products[1].price,
    status: "delivered" as OrderStatus,
    shippingAddress: {
      fullName: "Customer User",
      line1: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345",
      country: "United States",
      phone: "555-123-4567",
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-20T00:00:00Z",
  },
  {
    id: "order2",
    userId: "user2",
    items: [
      {
        id: "orderItem3",
        productId: "product3",
        product: products[2],
        quantity: 1,
        price: products[2].price,
      },
    ],
    total: products[2].price,
    status: "shipped" as OrderStatus,
    shippingAddress: {
      fullName: "Customer User",
      line1: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345",
      country: "United States",
      phone: "555-123-4567",
    },
    paymentMethod: "PayPal",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-03-05T00:00:00Z",
  },
];

// Categories
export const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Sports",
  "Office",
  "Beauty",
  "Toys",
];
