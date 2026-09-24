import type { RootState } from "@app/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAddToWishlist,
  fetchClearWishlist,
  fetchIsProductInWishlist,
  fetchRemoveFromWishlist,
  fetchWishlistByUserID,
  fetchWishlistCount,
  type TWishlistItem,
  type WishlistCountData,
} from "./wishlistAPI";
import { Logout } from "@auth/authSlice";
import axios from "axios";

export const GetwishlistCount = createAsyncThunk<
  WishlistCountData,
  void,
  { state: RootState; rejectValue: string }
>("wishlist/GetwishlistCount", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchWishlistCount();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch wishlist count",
      );
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Failed to fetch wishlist count");
  }
});

export const actLikeToggle = createAsyncThunk<
  { ProductID: number; isLiked: boolean },
  { ProductID: number },
  { state: RootState; rejectValue: string }
>("wishlist/actLikeToggle", async ({ ProductID }, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const isInWishlist = await fetchIsProductInWishlist(ProductID);
    if (isInWishlist) {
      await fetchRemoveFromWishlist(ProductID);
      return { ProductID, isLiked: false };
    } else {
      await fetchAddToWishlist(ProductID);
      return { ProductID, isLiked: true };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          `Failed to check wishlist status for product ID ${ProductID}`,
      );
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue(
      `Failed to check wishlist status for product ID ${ProductID}`,
    );
  }
});

export const GetWishlistByUserID = createAsyncThunk<
  TWishlistItem[],
  void,
  { state: RootState; rejectValue: string }
>("wishlist/GetWishlistByUserID", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const data = await fetchWishlistByUserID();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue(`Something went wrong`);
  }
});

export const GetClearWishlist = createAsyncThunk<
  boolean,
  void,
  { state: RootState; rejectValue: string }
>("wishlist/GetClearWishlist", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const data = await fetchClearWishlist();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          `Failed to clear wishlist`,
      );
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue(`Failed to clear wishlist`);
  }
});

export const RemoveWishlistItem = createAsyncThunk<
  number,
  { ProductID: number },
  { state: RootState; rejectValue: string }
>("wishlist/RemoveWishlistItem", async ({ ProductID }, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await fetchRemoveFromWishlist(ProductID);
    if (response && response == true) {
      return ProductID;
    } else {
      return rejectWithValue("Failed to remove item from wishlist");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove item",
      );
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Failed to remove item");
  }
});

interface IWishlist {
  items: number[];
  productsFullInfo: TWishlistItem[];
  wishlistCount: number;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  wishlisttotal: number;
}

const initialState: IWishlist = {
  items: [],
  productsFullInfo: [],
  wishlistCount: 0,
  loading: "idle",
  error: null,
  wishlisttotal: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishList: (state) => {
      state.wishlisttotal = 0;
      state.items = [];
      state.productsFullInfo = [];
    },
  },
  extraReducers: (builder) => {
    //////////////////GetwishlistCount/////////////////////
    builder.addCase(GetwishlistCount.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetwishlistCount.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.wishlistCount = action.payload.wishlistCount;
    });

    builder.addCase(GetwishlistCount.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////GetWishlistByUserID/////////////////////
    builder.addCase(GetWishlistByUserID.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetWishlistByUserID.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.productsFullInfo = action.payload;
      state.wishlisttotal = action.payload.length;

      state.items = action.payload.map((p) => p.productID);
    });
    builder.addCase(GetWishlistByUserID.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////actLikeToggle/////////////////////
    builder.addCase(actLikeToggle.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actLikeToggle.fulfilled, (state, action) => {
      state.loading = "succeeded";
      const { ProductID, isLiked } = action.payload;
      if (isLiked) {
        if (!state.items.includes(ProductID)) {
          state.items.push(ProductID);
        }
        state.wishlisttotal = state.wishlisttotal + 1;
      } else {
        state.items = state.items.filter((id) => id !== ProductID);

        state.productsFullInfo = state.productsFullInfo.filter(
          (p) => p.productID !== ProductID,
        );

        state.wishlisttotal = state.wishlisttotal - 1;
      }
    });
    builder.addCase(actLikeToggle.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////GetClearWishlist/////////////////////
    builder.addCase(GetClearWishlist.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetClearWishlist.fulfilled, (state, action) => {
      state.loading = "succeeded";
      if (action.payload) {
        state.items = [];
        state.productsFullInfo = [];
        state.wishlisttotal = 0;
        state.wishlistCount = 0;
      }
    });
    builder.addCase(GetClearWishlist.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////RemoveWishlistItem/////////////////////
    builder.addCase(RemoveWishlistItem.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(RemoveWishlistItem.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.productsFullInfo = state.productsFullInfo.filter(
        (e) => e.productID != action.payload,
      );
      state.wishlisttotal = state.productsFullInfo.length;
      state.wishlistCount = state.productsFullInfo.length;
      state.items = state.items.filter((id) => id !== action.payload);
    });
    builder.addCase(RemoveWishlistItem.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    //////////////////After Log out/////////////////////
    builder.addCase(Logout, (state) => {
      state.loading = "idle";
      state.error = null;

      state.items = [];
      state.productsFullInfo = [];
      state.wishlistCount = 0;
      state.wishlisttotal = 0;
    });
  },
});

export const { clearWishList } = wishlistSlice.actions;

export default wishlistSlice.reducer;
