import type { RootState } from "@app/store/store";
import { Logout } from "@auth/authSlice";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  fetchCartItemsByUserID,
  fetchCartSummary,
  fetchClearCart,
  IncrementDecrementCartItems,
  InsertUpdateCartItems,
  RemoveCartItem,
  type CartSummaryData,
  type TCartItem,
  type TClearCart,
  type TIncrementDecrementCartItem,
  type TInsertUpdateCartItem,
  type TRemoveCartItem,
} from "./CartAPI";
import axios from "axios";

export const GetCartSummary = createAsyncThunk<
  CartSummaryData,
  void,
  { state: RootState; rejectValue: string }
>("cart/GetCartSummary", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchCartSummary();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GetCartSummary error:", error);
      return rejectWithValue(error.message || `Failed to fetch cart summary`);
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(`Failed to fetch cart summary`);
  }
});

export const GetCartItemsByUserID = createAsyncThunk<
  TCartItem[],
  void,
  { rejectValue: string }
>("cart/GetCartItemsByUserID", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const data = await fetchCartItemsByUserID();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data || error.message || "");
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("");
  }
});

export const InsertUpdateCartItem = createAsyncThunk<
  TInsertUpdateCartItem,
  { ProductID: number },
  { state: RootState; rejectValue: string }
>("cart/InsertUpdateCartItems", async ({ ProductID }, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const data = await InsertUpdateCartItems(ProductID);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          `Failed to fetch data for ProductID = ${ProductID}`,
      );
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(`Failed to fetch data for ProductID = ${ProductID}`);
  }
});

export const RemoveFromCart = createAsyncThunk<
  TRemoveCartItem,
  { ProductID: number },
  { state: RootState; rejectValue: string }
>("cart/RemoveCartItem", async ({ ProductID }, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const data = await RemoveCartItem(ProductID);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          `Failed to fetch data for ProductID = ${ProductID}`,
      );
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(`Failed to fetch data for ProductID = ${ProductID}`);
  }
});

export const IncrementDecrementCartItem = createAsyncThunk<
  TIncrementDecrementCartItem,
  { ProductID: number; Action: "Increment" | "Decrement" },
  { state: RootState; rejectValue: string }
>(
  "cart/IncrementDecrementCartItem",
  async ({ ProductID, Action }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const data = await IncrementDecrementCartItems(ProductID, Action);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data ||
            error.message ||
            `Failed to fetch data for ProductID = ${ProductID}`,
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(
        `Failed to fetch data for ProductID = ${ProductID}`,
      );
    }
  },
);

export const ClearCart = createAsyncThunk<
  TClearCart,
  void,
  { state: RootState; rejectValue: string }
>("cart/ClearCart", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const data = await fetchClearCart();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data || error.message || `Failed to delete cart items`,
      );
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(`Failed to delete cart items`);
  }
});

interface ICartState {
  items: { [key: string]: number };
  productsFullInfo: TCartItem[];
  summary: CartSummaryData;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ICartState = {
  items: {},
  productsFullInfo: [],
  summary: {
    totalQuantity: 0,
    totalPrice: 0,
  },
  loading: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    localIncrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = String(action.payload);
      if (state.items[productId]) {
        state.items[productId] += 1;
        const product = state.productsFullInfo.find(
          (p) => p.productID === action.payload,
        );
        if (product) {
          product.quantity += 1;
          product.subtotal = product.price * product.quantity;
          state.summary.totalQuantity += 1;
          state.summary.totalPrice += product.price;
        }
      }
    },

    localDecrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = String(action.payload);
      if (state.items[productId]) {
        if (state.items[productId] > 1) {
          state.items[productId] -= 1;
          const product = state.productsFullInfo.find(
            (p) => p.productID === action.payload,
          );
          if (product) {
            product.quantity -= 1;
            product.subtotal = product.price * product.quantity;
            state.summary.totalQuantity -= 1;
            state.summary.totalPrice -= product.price;
          }
        } else {
          const product = state.productsFullInfo.find(
            (p) => p.productID === action.payload,
          );

          if (product) {
            state.summary.totalQuantity = Math.max(
              0,
              state.summary.totalQuantity - product.quantity,
            );
            state.summary.totalPrice = Math.max(
              0,
              state.summary.totalPrice - product.subtotal,
            );
          }
          delete state.items[productId];
          state.productsFullInfo = state.productsFullInfo.filter(
            (p) => p.productID !== action.payload,
          );
        }
      }
    },
    localRemoveItem: (state, action: PayloadAction<number>) => {
      const productId = String(action.payload);
      const qty = state.items[productId] || 0;
      const product = state.productsFullInfo.find(
        (p) => p.productID === action.payload,
      );
      if (product) {
        state.summary.totalQuantity = Math.max(
          0,
          state.summary.totalQuantity - qty,
        );
        state.summary.totalPrice = Math.max(
          0,
          state.summary.totalPrice - qty * product.price,
        );
      }
      delete state.items[productId];
      state.productsFullInfo = state.productsFullInfo.filter(
        (p) => p.productID !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    //////////////////GetCartSummary/////////////////////
    builder.addCase(GetCartSummary.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetCartSummary.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.summary = action.payload;
    });
    builder.addCase(GetCartSummary.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////GetCartItemsByUserID/////////////////////
    builder.addCase(GetCartItemsByUserID.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetCartItemsByUserID.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.productsFullInfo = action.payload;
      for (const p of action.payload) {
        const id = String(p.productID);
        state.items[id] = p.quantity;
      }
      const serverIds = new Set(action.payload.map((p) => String(p.productID)));
      for (const localId of Object.keys(state.items)) {
        if (!serverIds.has(localId)) {
          delete state.items[localId];
        }
      }
    });
    builder.addCase(GetCartItemsByUserID.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////InsertUpdateCartItem/////////////////////
    builder.addCase(InsertUpdateCartItem.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(InsertUpdateCartItem.fulfilled, (state, action) => {
      state.loading = "succeeded";
      const result = action.payload.data;
      if (!result) return;
      const productId = String(result.ProductID);
      const product = state.productsFullInfo.find(
        (p) => p.productID === result.ProductID,
      );
      if (result.Action === "Inserted") {
        state.items[productId] = 1;
        state.summary.totalQuantity += 1;
        if (product) {
          state.summary.totalPrice += product.price;
        }
      } else if (result.Action === "Updated") {
        if (state.items[productId]) {
          state.items[productId] += 1;
        } else {
          state.items[productId] = 1;
        }
        state.summary.totalQuantity += 1;
        if (product) {
          state.summary.totalPrice += product.price;
        }
      }
    });
    builder.addCase(InsertUpdateCartItem.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////RemoveFromCart/////////////////////
    builder.addCase(RemoveFromCart.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(RemoveFromCart.fulfilled, (state, action) => {
      state.loading = "succeeded";
      const result = action.payload.data;
      if (!result) return;
      const productId = String(result.ProductID);
      if (result.Action === "Deleted") {
        const removedQty = state.items[productId] || 0;
        const product = state.productsFullInfo.find(
          (p) => p.productID === Number(result.ProductID),
        );
        state.summary.totalQuantity = Math.max(
          0,
          state.summary.totalQuantity - removedQty,
        );
        if (product) {
          state.summary.totalPrice = Math.max(
            0,
            state.summary.totalPrice - product.price * removedQty,
          );
        }
        delete state.items[productId];
        state.productsFullInfo = state.productsFullInfo.filter(
          (p) => p.productID !== Number(result.ProductID),
        );
      } else if (result.Action === "NotFound") {
        state.error = action.payload.message || "Item not found";
      }
    });
    builder.addCase(RemoveFromCart.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////IncrementDecrementCartItem/////////////////////
    builder.addCase(IncrementDecrementCartItem.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(IncrementDecrementCartItem.fulfilled, (state, action) => {
      state.loading = "succeeded";
      const result = action.payload.data;
      if (!result) return;
      const productId = String(result?.productID);
      state.items[productId] = result.newQuantity;
      const product = state.productsFullInfo.find(
        (p) => p.productID === Number(result.productID),
      );
      if (product) {
        const oldQty = product.quantity;
        const diff = result.newQuantity - oldQty;
        product.quantity = result.newQuantity;
        product.subtotal = product.price * result.newQuantity;
        state.summary.totalQuantity += diff;
        state.summary.totalPrice += diff * product.price;
      }
    });
    builder.addCase(IncrementDecrementCartItem.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////GetClearCart/////////////////////
    builder.addCase(ClearCart.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(ClearCart.fulfilled, (state, action) => {
      state.loading = "succeeded";
      if (action.payload.data === true) {
        state.items = {};
        state.productsFullInfo = [];
        state.summary = { totalQuantity: 0, totalPrice: 0 };
      }
    });
    builder.addCase(ClearCart.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////After Log out/////////////////////
    builder.addCase(Logout, (state) => {
      state.loading = "idle";
      state.error = null;
      state.items = {};
      state.productsFullInfo = [];
      state.summary = { totalQuantity: 0, totalPrice: 0 };
    });
  },
});

export const {
  localIncrementQuantity,
  localDecrementQuantity,
  localRemoveItem,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartTotal = (state: RootState) => {
  return state.cart.summary.totalPrice;
};

export const selectCartQuantity = (state: RootState) => {
  return Object.values(state.cart.items).reduce((acc, qty) => acc + qty, 0);
};

export const selectCartSubtotalById =
  (productId: number) => (state: RootState) => {
    const qty = state.cart.items[String(productId)] ?? 0;
    const product = state.cart.productsFullInfo.find(
      (p) => p.productID === productId,
    );
    if (!product) return 0;
    return product.price * qty;
  };
