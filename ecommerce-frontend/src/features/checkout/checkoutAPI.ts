import axiosInstance from "@config/api/axios";
import axios from "axios";

export type TCheckoutResData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  defaultAddress: {
    addressID: number;
    userID: number;
    addressType: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
  defaultPaymentMethod: {
    paymentMethodID: number;
    brand: string;
    cardLast4: string;
    cardHolderName: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
  };
};

export type TCheckoutRes = {
  success: boolean;
  message: string;
  data: TCheckoutResData;
  errors: string | null;
};

export const fetchCheckoutDataAPI = async (): Promise<TCheckoutRes> => {
  try {
    const response = await axiosInstance.get<TCheckoutRes>(`/CheckoutInit`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching CheckoutInit:", error);
    }
    throw error;
  }
};

export type TCreateOrderRequest = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    addressType: string;
    streetAddress: string;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
  };
  orderAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
  };
  payment: {
    paymentMethodId: string;
    paymentBrand: string | null;
    paymentLast4: string | null;
  };
  items: {
    productId: number;
    quantity: number;
  }[];
  promoCode: string | null;
};

export type TCreateOrderResponse = {
  success: boolean;
  message: string;
  data: {
    paymentIntentId: string;
    finalAmount: number;
    clientSecret: string;
    orderNumber: string;
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
  };
  errors: string | null;
};

export const createOrderAPI = async (
  orderData: TCreateOrderRequest,
): Promise<TCreateOrderResponse> => {
  try {
    const response = await axiosInstance.post<TCreateOrderResponse>(
      `/CreateOrder`,
      orderData,
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating order:", error);
    }
    throw error;
  }
};
