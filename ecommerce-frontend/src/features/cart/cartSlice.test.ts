import { describe, expect, it, vi, beforeEach } from "vitest";

import reducer, {
  localIncrementQuantity,
  localDecrementQuantity,
  localRemoveItem,
} from "./cartSlice";

const product = {
  productID: 1,
  productName: "Test Product",
  quantity: 2,
  price: 100,
  subtotal: 200,
  imageUrl: "",
  altText: "Test Product",
  availableQuantity: 10,
};

const initialCartState = {
  items: {
    "1": 2,
  },
  productsFullInfo: [product],
  summary: {
    totalQuantity: 2,
    totalPrice: 200,
  },
  loading: "idle" as const,
  error: null,
};

describe("Cart Slice", () => {
  it("should increment product quantity locally", () => {
    const state = reducer(initialCartState, localIncrementQuantity(1));

    expect(state.items["1"]).toBe(3);
    expect(state.productsFullInfo[0].quantity).toBe(3);
    expect(state.productsFullInfo[0].subtotal).toBe(300);

    expect(state.summary.totalQuantity).toBe(3);
    expect(state.summary.totalPrice).toBe(300);
  });

  it("should decrement product quantity locally", () => {
    const state = reducer(initialCartState, localDecrementQuantity(1));

    expect(state.items["1"]).toBe(1);
    expect(state.productsFullInfo[0].quantity).toBe(1);
    expect(state.productsFullInfo[0].subtotal).toBe(100);

    expect(state.summary.totalQuantity).toBe(1);
    expect(state.summary.totalPrice).toBe(100);
  });

  it("should remove the product when decrementing quantity from 1", () => {
    const stateWithOneItem = {
      ...initialCartState,
      items: {
        "1": 1,
      },
      productsFullInfo: [
        {
          ...product,
          quantity: 1,
          subtotal: 100,
        },
      ],
      summary: {
        totalQuantity: 1,
        totalPrice: 100,
      },
    };

    const state = reducer(stateWithOneItem, localDecrementQuantity(1));

    expect(state.items).not.toHaveProperty("1");
    expect(state.productsFullInfo).toHaveLength(0);

    expect(state.summary.totalQuantity).toBe(0);
    expect(state.summary.totalPrice).toBe(0);
  });

  it("should remove a product from the cart", () => {
    const state = reducer(initialCartState, localRemoveItem(1));

    expect(state.items).not.toHaveProperty("1");
    expect(state.productsFullInfo).toHaveLength(0);

    expect(state.summary.totalQuantity).toBe(0);
    expect(state.summary.totalPrice).toBe(0);
  });
});

import {
  configureStore,
  combineReducers,
  type ThunkDispatch,
  type UnknownAction,
} from "@reduxjs/toolkit";

import cartReducer, {
  GetCartSummary,
  GetCartItemsByUserID,
  ClearCart,
} from "./cartSlice";

import authReducer from "@auth/authSlice";
import * as CartAPI from "./CartAPI";

vi.mock("./CartAPI", () => ({
  fetchCartSummary: vi.fn(),
  fetchCartItemsByUserID: vi.fn(),
  fetchClearCart: vi.fn(),
  InsertUpdateCartItems: vi.fn(),
  RemoveCartItem: vi.fn(),
  IncrementDecrementCartItems: vi.fn(),
}));

const mockProduct = {
  productID: 1,
  productName: "Test Product",
  quantity: 2,
  price: 100,
  subtotal: 200,
  imageUrl: "",
  altText: "Test Product",
  availableQuantity: 10,
};

const testReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
});

const createTestStore = () =>
  configureStore({
    reducer: testReducer,
    preloadedState: {
      auth: {
        RegisterReturn: null,
        LoginReturn: {
          token: "test-token",
        },
      },
    } as never,
  });

type TestStore = ReturnType<typeof createTestStore>;

import type { RootState } from "@app/store/store";
const dispatch = (store: TestStore) =>
  store.dispatch as typeof store.dispatch &
    ThunkDispatch<RootState, unknown, UnknownAction>;

describe("Cart Async Thunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get cart summary successfully", async () => {
    vi.mocked(CartAPI.fetchCartSummary).mockResolvedValue({
      totalQuantity: 2,
      totalPrice: 200,
    });

    const store = createTestStore();

    const result = await dispatch(store)(GetCartSummary()); //redline

    expect(result.type).toBe("cart/GetCartSummary/fulfilled");
    expect(store.getState().cart.summary).toEqual({
      totalQuantity: 2,
      totalPrice: 200,
    });

    expect(store.getState().cart.loading).toBe("succeeded");
  });

  it("should get cart items successfully", async () => {
    vi.mocked(CartAPI.fetchCartItemsByUserID).mockResolvedValue([mockProduct]);

    const store = createTestStore();

    const result = await dispatch(store)(GetCartItemsByUserID());

    expect(result.type).toBe("cart/GetCartItemsByUserID/fulfilled");
    expect(store.getState().cart.productsFullInfo).toEqual([mockProduct]);
    expect(store.getState().cart.items).toEqual({
      "1": 2,
    });
    expect(store.getState().cart.loading).toBe("succeeded");
  });

  it("should clear the cart successfully", async () => {
    vi.mocked(CartAPI.fetchClearCart).mockResolvedValue({
      success: true,
      message: "Cart cleared successfully",
      data: true,
      errors: null,
    });

    const store = createTestStore();

    const result = await dispatch(store)(ClearCart()); //redline

    expect(result.type).toBe("cart/ClearCart/fulfilled");
    expect(store.getState().cart.items).toEqual({});
    expect(store.getState().cart.productsFullInfo).toEqual([]);
    expect(store.getState().cart.summary).toEqual({
      totalQuantity: 0,
      totalPrice: 0,
    });
    expect(store.getState().cart.loading).toBe("succeeded");
  });
});
