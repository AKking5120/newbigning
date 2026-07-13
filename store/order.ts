import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cart";
import type { ShippingAddress } from "./checkout";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface OrderItem extends CartItem {
  productName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
  paymentId?: string;
  transactionId?: string;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;

  // Actions
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => Order;
  getOrder: (orderId: string) => Order | undefined;
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateTrackingInfo: (
    orderId: string,
    trackingNumber: string,
    estimatedDelivery: string
  ) => void;
  cancelOrder: (orderId: string) => void;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      createOrder: (orderData) => {
        const order: Order = {
          id: `order_${Date.now()}`,
          orderNumber: `ORD-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`,
          ...orderData,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [...state.orders, order],
          currentOrder: order,
        }));

        return order;
      },

      getOrder: (orderId) => {
        return get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      },

      getAllOrders: () => {
        return get().orders;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId || order.orderNumber === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        }));
      },

      updateTrackingInfo: (orderId, trackingNumber, estimatedDelivery) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId || order.orderNumber === orderId
              ? {
                  ...order,
                  trackingNumber,
                  estimatedDelivery,
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        }));
      },

      cancelOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId || order.orderNumber === orderId
              ? {
                  ...order,
                  status: "cancelled",
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        }));
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },
    }),
    { name: "radhaji-orders" }
  )
);
