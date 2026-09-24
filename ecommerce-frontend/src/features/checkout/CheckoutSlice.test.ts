import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import type { AppDispatch } from "@app/store/store";

import checkoutReducer, {
  GetUserCheckoutThunk,
  PlaceOrderThunk,
} from "./checkoutSlice";

import * as CheckoutAPI from "./checkoutAPI";

import authReducer from "../auth/authSlice";

vi.mock("./checkoutAPI", async () => {
  const actual =
    await vi.importActual<typeof import("./checkoutAPI")>("./checkoutAPI");

  return {
    ...actual,
    fetchCheckoutDataAPI: vi.fn(),
    createOrderAPI: vi.fn(),
  };
});

const { mockConfirmCardPayment } = vi.hoisted(() => ({
  mockConfirmCardPayment: vi.fn(),
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn().mockResolvedValue({
    confirmCardPayment: mockConfirmCardPayment,
  }),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  CardElement: {},
}));

const createTestStore = (token: string | null = "test-token") => {
  const initialAuthState = authReducer(undefined, {
    type: "@@TEST/INIT",
  });

  const authState = {
    ...initialAuthState,
    LoginReturn: token
      ? {
          userID: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "Customer",
          isEmailVerified: true,
          token,
          success: true,
          message: "Login successful",
        }
      : null,
  };

  return configureStore({
    reducer: {
      checkout: checkoutReducer,
      auth: authReducer,
    },
    preloadedState: {
      auth: authState,
    },
  });
};

const dispatchThunk = (store: ReturnType<typeof createTestStore>) =>
  store.dispatch as unknown as AppDispatch;

const mockCheckoutResponse = {
  success: true,
  message: "Checkout data fetched successfully",
  data: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "01000000000",

    defaultAddress: {
      addressID: 1,
      userID: 1,
      addressType: "Home",
      streetAddress: "123 Test Street",
      city: "Cairo",
      state: "Cairo",
      postalCode: "11511",
      country: "Egypt",
      isDefault: true,
      createdAt: "2026-08-16T10:00:00.000Z",
      updatedAt: "2026-08-16T10:00:00.000Z",
    },

    defaultPaymentMethod: {
      paymentMethodID: 1,
      brand: "visa",
      cardLast4: "4242",
      cardHolderName: "John Doe",
      expiryMonth: 12,
      expiryYear: 2030,
      isDefault: true,
    },
  },
  errors: null,
};

const mockOrderData = {
  customer: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "01000000000",
  },

  address: {
    addressType: "Home",
    streetAddress: "123 Test Street",
    city: "Cairo",
    state: "Cairo",
    postalCode: "11511",
    country: "Egypt",
  },

  orderAddress: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "01000000000",
    streetAddress: "123 Test Street",
    city: "Cairo",
    state: "Cairo",
    postalCode: "11511",
    country: "Egypt",
  },

  payment: {
    paymentMethodId: "1",
    paymentBrand: "visa",
    paymentLast4: "4242",
  },

  items: [
    {
      productId: 10,
      quantity: 2,
    },
  ],

  promoCode: null,
};

const mockOrderResponse = {
  success: true,
  message: "Order created successfully",
  data: {
    paymentIntentId: "pi_test_123",
    finalAmount: 250,
    clientSecret: "secret_test_123",
    orderNumber: "ORD-1001",
    subtotal: 200,
    shipping: 20,
    tax: 30,
    discount: 0,
  },
  errors: null,
};

describe("Checkout Async Thunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GetUserCheckoutThunk", () => {
    it("should get checkout data successfully", async () => {
      vi.mocked(CheckoutAPI.fetchCheckoutDataAPI).mockResolvedValue(
        mockCheckoutResponse,
      );

      const store = createTestStore();

      const result = await dispatchThunk(store)(GetUserCheckoutThunk());

      expect(result.type).toBe("checkout/GetUserCheckoutThunk/fulfilled");
      expect(CheckoutAPI.fetchCheckoutDataAPI).toHaveBeenCalledTimes(1);
      expect(store.getState().checkout.loading).toBe("succeeded");
      expect(store.getState().checkout.error).toBeNull();
      expect(store.getState().checkout.CheckoutRes).toEqual(
        mockCheckoutResponse.data,
      );
    });

    it("should fail when user is not authenticated", async () => {
      const store = createTestStore(null);

      const result = await dispatchThunk(store)(GetUserCheckoutThunk());

      expect(result.type).toBe("checkout/GetUserCheckoutThunk/rejected");
      expect(result.payload).toBe("Unauthorized: No token found");
      expect(CheckoutAPI.fetchCheckoutDataAPI).not.toHaveBeenCalled();
      expect(store.getState().checkout.loading).toBe("failed");
      expect(store.getState().checkout.error).toBe(
        "Unauthorized: No token found",
      );
    });

    it("should fail when fetching checkout data fails", async () => {
      vi.mocked(CheckoutAPI.fetchCheckoutDataAPI).mockRejectedValue(
        new Error("Failed to fetch checkout data"),
      );

      const store = createTestStore();

      const result = await dispatchThunk(store)(GetUserCheckoutThunk());

      expect(result.type).toBe("checkout/GetUserCheckoutThunk/rejected");
      expect(result.payload).toBe("Failed to fetch checkout data");
      expect(store.getState().checkout.loading).toBe("failed");
      expect(store.getState().checkout.error).toBe(
        "Failed to fetch checkout data",
      );
    });
  });

  describe("PlaceOrderThunk", () => {
    it("should place order and confirm payment successfully", async () => {
      vi.mocked(CheckoutAPI.createOrderAPI).mockResolvedValue(
        mockOrderResponse,
      );

      mockConfirmCardPayment.mockResolvedValue({
        paymentIntent: {
          id: "pi_test_123",
          status: "succeeded",
        },
      });

      const store = createTestStore();

      const result = await dispatchThunk(store)(PlaceOrderThunk(mockOrderData));

      expect(result.type).toBe("checkout/PlaceOrderThunk/fulfilled");
      expect(CheckoutAPI.createOrderAPI).toHaveBeenCalledTimes(1);
      expect(CheckoutAPI.createOrderAPI).toHaveBeenCalledWith(mockOrderData);
      expect(mockConfirmCardPayment).toHaveBeenCalledTimes(1);
      expect(store.getState().checkout.orderLoading).toBe("succeeded");
      expect(store.getState().checkout.orderError).toBeNull();
      expect(store.getState().checkout.orderResult).toEqual({
        paymentIntentId: "pi_test_123",
      });
    });

    it("should fail when creating order fails", async () => {
      vi.mocked(CheckoutAPI.createOrderAPI).mockRejectedValue(
        new Error("Failed to create order"),
      );

      const store = createTestStore();

      const result = await dispatchThunk(store)(PlaceOrderThunk(mockOrderData));

      expect(result.type).toBe("checkout/PlaceOrderThunk/rejected");
      expect(result.payload).toBe("Failed to create order");
      expect(CheckoutAPI.createOrderAPI).toHaveBeenCalledTimes(1);
      expect(store.getState().checkout.orderLoading).toBe("failed");
      expect(store.getState().checkout.orderError).toBe(
        "Failed to create order",
      );

      expect(store.getState().checkout.orderResult).toBeNull();
    });

    it("should fail when Stripe payment fails", async () => {
      vi.mocked(CheckoutAPI.createOrderAPI).mockResolvedValue(
        mockOrderResponse,
      );

      mockConfirmCardPayment.mockResolvedValue({
        error: {
          message: "Your card was declined",
        },
      });

      const store = createTestStore();

      const result = await dispatchThunk(store)(PlaceOrderThunk(mockOrderData));

      expect(result.type).toBe("checkout/PlaceOrderThunk/rejected");
      expect(result.payload).toBe("Your card was declined");
      expect(store.getState().checkout.orderLoading).toBe("failed");
      expect(store.getState().checkout.orderError).toBe(
        "Your card was declined",
      );
      expect(store.getState().checkout.orderResult).toBeNull();
    });

    it("should fail when Stripe fails to load", async () => {
      vi.mocked(CheckoutAPI.createOrderAPI).mockResolvedValue(
        mockOrderResponse,
      );

      const { loadStripe } = await import("@stripe/stripe-js");

      vi.mocked(loadStripe).mockResolvedValue(null);

      const store = createTestStore();

      const result = await dispatchThunk(store)(PlaceOrderThunk(mockOrderData));

      expect(result.type).toBe("checkout/PlaceOrderThunk/rejected");
      expect(result.payload).toBe("Stripe failed to load");
      expect(CheckoutAPI.createOrderAPI).toHaveBeenCalledTimes(1);
      expect(store.getState().checkout.orderLoading).toBe("failed");
      expect(store.getState().checkout.orderError).toBe(
        "Stripe failed to load",
      );

      expect(store.getState().checkout.orderResult).toBeNull();
    });

    it("should fail when Stripe confirmation throws an error", async () => {
      vi.mocked(CheckoutAPI.createOrderAPI).mockResolvedValue(
        mockOrderResponse,
      );

      mockConfirmCardPayment.mockRejectedValue(
        new Error("Stripe confirmation failed"),
      );

      const { loadStripe } = await import("@stripe/stripe-js");

      vi.mocked(loadStripe).mockResolvedValue({
        confirmCardPayment: mockConfirmCardPayment,
      } as never);

      const store = createTestStore();

      const result = await dispatchThunk(store)(PlaceOrderThunk(mockOrderData));

      expect(result.type).toBe("checkout/PlaceOrderThunk/rejected");
      expect(result.payload).toBe("Stripe confirmation failed");
      expect(CheckoutAPI.createOrderAPI).toHaveBeenCalledTimes(1);
      expect(mockConfirmCardPayment).toHaveBeenCalledTimes(1);
      expect(store.getState().checkout.orderLoading).toBe("failed");
      expect(store.getState().checkout.orderError).toBe(
        "Stripe confirmation failed",
      );
      expect(store.getState().checkout.orderResult).toBeNull();
    });
  });
});
