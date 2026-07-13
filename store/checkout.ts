import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ShippingMethod = "standard" | "express";
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "emi" | "cod";

export interface ShippingAddress {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ShippingOption {
  method: ShippingMethod;
  name: string;
  price: number;
  estimatedDays: number;
  description: string;
}

export interface CheckoutState {
  // Cart data
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingCharge: number;
  total: number;

  // Shipping
  shippingAddress: ShippingAddress | null;
  savedAddresses: ShippingAddress[];
  shippingMethod: ShippingMethod;

  // Payment
  paymentMethod: PaymentMethod | null;

  // State tracking
  currentStep: number; // 0: Cart, 1: Address, 2: Shipping, 3: Payment, 4: Confirm
  isProcessing: boolean;

  // Actions
  setSubtotal: (amount: number) => void;
  setDiscount: (amount: number, coupon?: string) => void;
  setTax: (amount: number) => void;
  setShippingCharge: (amount: number) => void;
  calculateTotal: () => void;

  setShippingAddress: (address: ShippingAddress) => void;
  addSavedAddress: (address: ShippingAddress) => void;
  removeSavedAddress: (id: string) => void;
  setShippingMethod: (method: ShippingMethod) => void;

  setPaymentMethod: (method: PaymentMethod) => void;

  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsProcessing: (processing: boolean) => void;

  // Reset
  resetCheckout: () => void;
}

const SHIPPING_OPTIONS: Record<ShippingMethod, ShippingOption> = {
  standard: {
    method: "standard",
    name: "Standard Delivery",
    price: 0,
    estimatedDays: 5,
    description: "Delivery in 5-7 business days",
  },
  express: {
    method: "express",
    name: "Express Delivery",
    price: 99,
    estimatedDays: 1,
    description: "Next day delivery",
  },
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      subtotal: 0,
      discount: 0,
      couponCode: undefined,
      tax: 0,
      shippingCharge: 0,
      total: 0,

      shippingAddress: null,
      savedAddresses: [],
      shippingMethod: "standard",

      paymentMethod: null,

      currentStep: 0,
      isProcessing: false,

      setSubtotal: (amount) => {
        set({ subtotal: amount });
        get().calculateTotal();
      },

      setDiscount: (amount, coupon) => {
        set({ discount: amount, couponCode: coupon });
        get().calculateTotal();
      },

      setTax: (amount) => {
        set({ tax: amount });
        get().calculateTotal();
      },

      setShippingCharge: (amount) => {
        set({ shippingCharge: amount });
        get().calculateTotal();
      },

      calculateTotal: () => {
        const { subtotal, discount, tax, shippingCharge } = get();
        const total = Math.max(0, subtotal - discount + tax + shippingCharge);
        set({ total });
      },

      setShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      addSavedAddress: (address) => {
        const newAddress = {
          ...address,
          id: `addr_${Date.now()}`,
        };
        set((state) => ({
          savedAddresses: [...state.savedAddresses, newAddress],
        }));
      },

      removeSavedAddress: (id) => {
        set((state) => ({
          savedAddresses: state.savedAddresses.filter((addr) => addr.id !== id),
        }));
      },

      setShippingMethod: (method) => {
        const shippingCharge = SHIPPING_OPTIONS[method].price;
        set({ shippingMethod: method, shippingCharge });
        get().calculateTotal();
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      setCurrentStep: (step) => {
        set({ currentStep: Math.min(4, Math.max(0, step)) });
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 4) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      setIsProcessing: (processing) => {
        set({ isProcessing: processing });
      },

      resetCheckout: () => {
        set({
          subtotal: 0,
          discount: 0,
          couponCode: undefined,
          tax: 0,
          shippingCharge: 0,
          total: 0,
          shippingAddress: null,
          shippingMethod: "standard",
          paymentMethod: null,
          currentStep: 0,
          isProcessing: false,
        });
      },
    }),
    { name: "radhaji-checkout" }
  )
);

export const SHIPPING_OPTIONS_ARRAY = Object.values(SHIPPING_OPTIONS);
