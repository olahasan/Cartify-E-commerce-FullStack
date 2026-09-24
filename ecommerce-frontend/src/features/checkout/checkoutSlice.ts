import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrderAPI,
  fetchCheckoutDataAPI,
  type TCheckoutRes,
  type TCheckoutResData,
  type TCreateOrderRequest,
} from "./checkoutAPI";
import type { RootState } from "@app/store/store";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";

export const GetUserCheckoutThunk = createAsyncThunk<
  TCheckoutRes,
  void,
  { state: RootState; rejectValue: string }
>("checkout/GetUserCheckoutThunk", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchCheckoutDataAPI();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("GetUserCheckoutThunk error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch User Checkout");
  }
});

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const PlaceOrderThunk = createAsyncThunk<
  { paymentIntentId: string },
  TCreateOrderRequest,
  { state: RootState; rejectValue: string }
>("checkout/PlaceOrderThunk", async (orderData, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await createOrderAPI(orderData);
    const { clientSecret, paymentIntentId } = response.data;
    const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    if (!stripe) throw new Error("Stripe failed to load");
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: CardElement,
      },
    });
    if (result.error) {
      return rejectWithValue(result.error.message ?? "Payment failed");
    }
    return { paymentIntentId };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to place order");
  }
});

interface IProfileState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  CheckoutRes: TCheckoutResData | null;
  orderResult: { paymentIntentId: string } | null;
  orderLoading: "idle" | "pending" | "succeeded" | "failed";
  orderError: string | null;
}

const initialState: IProfileState = {
  loading: "idle",
  error: null,
  CheckoutRes: null,
  orderResult: null,
  orderLoading: "idle",
  orderError: null,
};

const CheckoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    ////////////////// GetUserAddresses /////////////////////
    builder.addCase(GetUserCheckoutThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetUserCheckoutThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.CheckoutRes = action.payload.data;
    });
    builder.addCase(GetUserCheckoutThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// PlaceOrderThunk /////////////////////
    builder.addCase(PlaceOrderThunk.pending, (state) => {
      state.orderLoading = "pending";
      state.orderError = null;
    });
    builder.addCase(PlaceOrderThunk.fulfilled, (state, action) => {
      state.orderLoading = "succeeded";
      state.orderResult = action.payload;
    });
    builder.addCase(PlaceOrderThunk.rejected, (state, action) => {
      state.orderLoading = "failed";
      state.orderError = action.payload ?? "Unknown error";
    });
  },
});

export default CheckoutSlice.reducer;
