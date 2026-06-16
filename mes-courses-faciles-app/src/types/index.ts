export interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  role: 'CLIENT' | 'ADMIN';
  createdAt: Date;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  logo: string | null;
  description: string | null;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  oldPrice?: number;
  category: string;
  stock: number;
  unit: string | null;
  images: string | null;
  isActive: boolean;
  storeId: string;
  store?: Store;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  total: number;
  deliveryFee: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: Date;
  orderItems?: OrderItem[];
  store?: Store;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: 'CLIENT' | 'ADMIN';
}
