import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@app/store/store";
import {
  validatePromoCodeAPI,
  type TvalidatePromoCodeReq,
  type TvalidatePromoCodeRes,
} from "./promoApi";
import axios from "axios";

export const validatePromoCodeThunk = createAsyncThunk<
  TvalidatePromoCodeRes,
  TvalidatePromoCodeReq,
  { state: RootState; rejectValue: TvalidatePromoCodeRes }
>(
  "promo/validatePromoCodeThunk",
  async (PromoCodeData: TvalidatePromoCodeReq, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const data = await validatePromoCodeAPI(PromoCodeData);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        isValid: false,
        message: "Failed to validate promo code",
        discountAmount: 0,
      });
    }
  },
);

export interface IPromoState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  promoRes: TvalidatePromoCodeRes | undefined;
}

const initialState: IPromoState = {
  loading: "idle",
  error: null,
  promoRes: undefined,
};

const promoSlice = createSlice({
  name: "promo",
  initialState,
  reducers: {
    clearPromo: (state) => {
      state.promoRes = undefined;
      state.loading = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    ////////////////// validatePromoCode /////////////////////
    builder.addCase(validatePromoCodeThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(validatePromoCodeThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.promoRes = action.payload;
    });

    builder.addCase(validatePromoCodeThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.promoRes = action.payload;
      state.error = action.payload?.message ?? "Something went wrong";
    });
  },
});

export const { clearPromo } = promoSlice.actions;
export default promoSlice.reducer;
