import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  configureStore,
  combineReducers,
  type ThunkDispatch,
  type UnknownAction,
} from "@reduxjs/toolkit";

import reducer, {
  actLikeToggle,
  clearWishList,
  GetwishlistCount,
  GetWishlistByUserID,
  GetClearWishlist,
  RemoveWishlistItem,
} from "./wishlistSlice";

import authReducer from "@auth/authSlice";
import * as WishlistAPI from "./wishlistAPI";

vi.mock("./wishlistAPI", () => ({
  fetchWishlistCount: vi.fn(),
  fetchWishlistByUserID: vi.fn(),
  fetchIsProductInWishlist: vi.fn(),
  fetchAddToWishlist: vi.fn(),
  fetchRemoveFromWishlist: vi.fn(),
  fetchClearWishlist: vi.fn(),
}));

const mockProduct = {
  wishlistID: 1,
  userID: 1,
  productID: 10,
  productName: "Test Product",
  description: "Test Description",
  price: 100,
  quantity: 2,
  rating: 4.5,
  totalReviews: 10,
  imageUrl: "",
  AddedToWishlistAt: new Date("2026-08-14T21:00:19.458Z"),
};

const testReducer = combineReducers({
  wishlist: reducer,
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

beforeEach(() => {
  vi.clearAllMocks();
});
describe("Wishlist Async Thunks", () => {
  it("should get wishlist count successfully", async () => {
    vi.mocked(WishlistAPI.fetchWishlistCount).mockResolvedValue({
      wishlistCount: 3,
    });

    const store = createTestStore();

    const result = await dispatch(store)(GetwishlistCount());

    expect(result.type).toBe("wishlist/GetwishlistCount/fulfilled");
    expect(store.getState().wishlist.wishlistCount).toBe(3);
    expect(store.getState().wishlist.loading).toBe("succeeded");
    expect(WishlistAPI.fetchWishlistCount).toHaveBeenCalledTimes(1);
  });

  it("should get wishlist products successfully", async () => {
    vi.mocked(WishlistAPI.fetchWishlistByUserID).mockResolvedValue([
      mockProduct,
    ]);

    const store = createTestStore();

    const result = await dispatch(store)(GetWishlistByUserID());

    expect(result.type).toBe("wishlist/GetWishlistByUserID/fulfilled");
    expect(store.getState().wishlist.productsFullInfo).toEqual([mockProduct]);
    expect(store.getState().wishlist.items).toEqual([10]);
    expect(store.getState().wishlist.wishlisttotal).toBe(1);
    expect(store.getState().wishlist.loading).toBe("succeeded");
    expect(WishlistAPI.fetchWishlistByUserID).toHaveBeenCalledTimes(1);
  });

  it("should clear the wishlist successfully", async () => {
    vi.mocked(WishlistAPI.fetchClearWishlist).mockResolvedValue(true);

    const store = createTestStore();

    const result = await dispatch(store)(GetClearWishlist());

    expect(result.type).toBe("wishlist/GetClearWishlist/fulfilled");
    expect(store.getState().wishlist.items).toEqual([]);
    expect(store.getState().wishlist.productsFullInfo).toEqual([]);
    expect(store.getState().wishlist.wishlisttotal).toBe(0);
    expect(store.getState().wishlist.wishlistCount).toBe(0);
    expect(store.getState().wishlist.loading).toBe("succeeded");
    expect(WishlistAPI.fetchClearWishlist).toHaveBeenCalledTimes(1);
  });

  it("should remove a wishlist product successfully", async () => {
    vi.mocked(WishlistAPI.fetchRemoveFromWishlist).mockResolvedValue(true);

    const store = configureStore({
      reducer: testReducer,
      preloadedState: {
        wishlist: {
          items: [10, 20],
          productsFullInfo: [mockProduct],
          wishlistCount: 2,
          loading: "idle",
          error: null,
          wishlisttotal: 2,
        },
        auth: {
          RegisterReturn: null,
          LoginReturn: {
            token: "test-token",
          },
        },
      } as never,
    });

    const result = await dispatch(store)(RemoveWishlistItem({ ProductID: 10 }));

    expect(result.type).toBe("wishlist/RemoveWishlistItem/fulfilled");
    expect(store.getState().wishlist.items).toEqual([20]);
    expect(store.getState().wishlist.productsFullInfo).toEqual([]);
    expect(store.getState().wishlist.wishlisttotal).toBe(0);
    expect(store.getState().wishlist.wishlistCount).toBe(0);
    expect(store.getState().wishlist.loading).toBe("succeeded");
    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledWith(10);
  });
});

describe("Wishlist Slice", () => {
  it("should clear the wishlist locally", () => {
    const initialState = {
      items: [10, 20],
      productsFullInfo: [mockProduct],
      wishlistCount: 2,
      loading: "succeeded" as const,
      error: null,
      wishlisttotal: 2,
    };

    const state = reducer(initialState, clearWishList());
    expect(state.items).toEqual([]);
    expect(state.productsFullInfo).toEqual([]);
    expect(state.wishlisttotal).toBe(0);
    expect(state.wishlistCount).toBe(2);
  });

  it("should add a product when actLikeToggle is fulfilled with isLiked true", () => {
    const initialState = {
      items: [20],
      productsFullInfo: [],
      wishlistCount: 1,
      loading: "pending" as const,
      error: null,
      wishlisttotal: 1,
    };

    const action = actLikeToggle.fulfilled(
      {
        ProductID: 10,
        isLiked: true,
      },
      "test-request-id",
      {
        ProductID: 10,
      },
    );

    const state = reducer(initialState, action);

    expect(state.items).toEqual([20, 10]);
    expect(state.wishlisttotal).toBe(2);
    expect(state.loading).toBe("succeeded");
  });

  it("should remove a product when actLikeToggle is fulfilled with isLiked false", () => {
    const initialState = {
      items: [10, 20],
      productsFullInfo: [mockProduct],
      wishlistCount: 2,
      loading: "pending" as const,
      error: null,
      wishlisttotal: 2,
    };

    const action = actLikeToggle.fulfilled(
      {
        ProductID: 10,
        isLiked: false,
      },
      "test-request-id",
      {
        ProductID: 10,
      },
    );

    const state = reducer(initialState, action);

    expect(state.items).toEqual([20]);
    expect(state.productsFullInfo).toEqual([]);
    expect(state.wishlisttotal).toBe(1);
    expect(state.loading).toBe("succeeded");
  });

  it("should fail when fetching wishlist count fails", async () => {
    vi.mocked(WishlistAPI.fetchWishlistCount).mockRejectedValue(
      new Error("Failed to fetch wishlist count"),
    );

    const store = createTestStore();

    const result = await dispatch(store)(GetwishlistCount());

    expect(result.type).toBe("wishlist/GetwishlistCount/rejected");

    expect(store.getState().wishlist.loading).toBe("failed");

    expect(store.getState().wishlist.error).toBe(
      "Failed to fetch wishlist count",
    );

    expect(WishlistAPI.fetchWishlistCount).toHaveBeenCalledTimes(1);
  });

  it("should fail when fetching wishlist products fails", async () => {
    vi.mocked(WishlistAPI.fetchWishlistByUserID).mockRejectedValue(
      new Error("Failed to fetch wishlist products"),
    );

    const store = createTestStore();

    const result = await dispatch(store)(GetWishlistByUserID());

    expect(result.type).toBe("wishlist/GetWishlistByUserID/rejected");

    expect(store.getState().wishlist.loading).toBe("failed");

    expect(store.getState().wishlist.error).toBe(
      "Failed to fetch wishlist products",
    );

    expect(WishlistAPI.fetchWishlistByUserID).toHaveBeenCalledTimes(1);
  });

  it("should fail when clearing wishlist fails", async () => {
    vi.mocked(WishlistAPI.fetchClearWishlist).mockRejectedValue(
      new Error("Failed to clear wishlist"),
    );

    const store = createTestStore();

    const result = await dispatch(store)(GetClearWishlist());

    expect(result.type).toBe("wishlist/GetClearWishlist/rejected");

    expect(store.getState().wishlist.loading).toBe("failed");

    expect(store.getState().wishlist.error).toBe("Failed to clear wishlist");

    expect(WishlistAPI.fetchClearWishlist).toHaveBeenCalledTimes(1);
  });

  it("should fail when removing a wishlist product fails", async () => {
    vi.mocked(WishlistAPI.fetchRemoveFromWishlist).mockRejectedValue(
      new Error("Failed to remove item"),
    );

    const store = configureStore({
      reducer: testReducer,
      preloadedState: {
        wishlist: {
          items: [10, 20],
          productsFullInfo: [mockProduct],
          wishlistCount: 2,
          loading: "idle",
          error: null,
          wishlisttotal: 2,
        },
        auth: {
          RegisterReturn: null,
          LoginReturn: {
            token: "test-token",
          },
        },
      } as never,
    });

    const result = await dispatch(store)(RemoveWishlistItem({ ProductID: 10 }));

    expect(result.type).toBe("wishlist/RemoveWishlistItem/rejected");

    expect(store.getState().wishlist.loading).toBe("failed");

    expect(store.getState().wishlist.error).toBe("Failed to remove item");

    expect(store.getState().wishlist.items).toEqual([10, 20]);

    expect(store.getState().wishlist.wishlisttotal).toBe(2);

    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledTimes(1);

    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledWith(10);
  });

  it("should add product when product is not in wishlist", async () => {
    vi.mocked(WishlistAPI.fetchIsProductInWishlist).mockResolvedValue(false);
    vi.mocked(WishlistAPI.fetchAddToWishlist).mockResolvedValue(true);

    const store = createTestStore();

    const result = await dispatch(store)(actLikeToggle({ ProductID: 10 }));

    expect(result.type).toBe("wishlist/actLikeToggle/fulfilled");

    expect(result.payload).toEqual({
      ProductID: 10,
      isLiked: true,
    });

    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchAddToWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchAddToWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchRemoveFromWishlist).not.toHaveBeenCalled();
  });

  it("should remove product when product is already in wishlist", async () => {
    vi.mocked(WishlistAPI.fetchIsProductInWishlist).mockResolvedValue(true);
    vi.mocked(WishlistAPI.fetchRemoveFromWishlist).mockResolvedValue(true);

    const store = createTestStore();

    const result = await dispatch(store)(actLikeToggle({ ProductID: 10 }));

    expect(result.type).toBe("wishlist/actLikeToggle/fulfilled");

    expect(result.payload).toEqual({
      ProductID: 10,
      isLiked: false,
    });

    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchAddToWishlist).not.toHaveBeenCalled();
  });

  it("should fail when checking if product is in wishlist fails", async () => {
    vi.mocked(WishlistAPI.fetchIsProductInWishlist).mockRejectedValue(
      new Error("Failed to check wishlist status"),
    );

    const store = createTestStore();

    const result = await dispatch(store)(actLikeToggle({ ProductID: 10 }));

    expect(result.type).toBe("wishlist/actLikeToggle/rejected");

    expect(result.payload).toBe("Failed to check wishlist status");

    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchAddToWishlist).not.toHaveBeenCalled();
    expect(WishlistAPI.fetchRemoveFromWishlist).not.toHaveBeenCalled();

    expect(store.getState().wishlist.loading).toBe("failed");
    expect(store.getState().wishlist.error).toBe(
      "Failed to check wishlist status",
    );
  });

  it("should fail when adding product to wishlist fails", async () => {
    vi.mocked(WishlistAPI.fetchIsProductInWishlist).mockResolvedValue(false);

    vi.mocked(WishlistAPI.fetchAddToWishlist).mockRejectedValue(
      new Error("Failed to add item"),
    );

    const store = createTestStore();

    const result = await dispatch(store)(actLikeToggle({ ProductID: 10 }));

    expect(result.type).toBe("wishlist/actLikeToggle/rejected");

    expect(result.payload).toBe("Failed to add item");

    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchAddToWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchAddToWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchRemoveFromWishlist).not.toHaveBeenCalled();

    expect(store.getState().wishlist.loading).toBe("failed");
    expect(store.getState().wishlist.error).toBe("Failed to add item");
  });

  it("should fail when removing product from wishlist fails", async () => {
    vi.mocked(WishlistAPI.fetchIsProductInWishlist).mockResolvedValue(true);

    vi.mocked(WishlistAPI.fetchRemoveFromWishlist).mockRejectedValue(
      new Error("Failed to remove item"),
    );

    const store = createTestStore();

    const result = await dispatch(store)(actLikeToggle({ ProductID: 10 }));

    expect(result.type).toBe("wishlist/actLikeToggle/rejected");

    expect(result.payload).toBe("Failed to remove item");

    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchIsProductInWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledTimes(1);
    expect(WishlistAPI.fetchRemoveFromWishlist).toHaveBeenCalledWith(10);

    expect(WishlistAPI.fetchAddToWishlist).not.toHaveBeenCalled();

    expect(store.getState().wishlist.loading).toBe("failed");
    expect(store.getState().wishlist.error).toBe("Failed to remove item");
  });
});
