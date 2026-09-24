import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchSearchedProductsAPI,
  fetchSuggestionsAPI,
  type SearchedProductsData,
  type SuggestionsData,
} from "./searchAPI";
import type { RootState } from "@app/store/store";
import axios from "axios";

export const GetSearchedProductsThunk = createAsyncThunk<
  SearchedProductsData,
  {
    searchTerm: string;
    pageNumber: number;
    pageSize: number;
  },
  { state: RootState; rejectValue: string }
>(
  "search/GetSearchedProductsThunk",
  async ({ searchTerm, pageNumber, pageSize }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const data = await fetchSearchedProductsAPI(
        searchTerm,
        pageNumber,
        pageSize,
      );
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch search results",
        );
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Failed to fetch search results");
    }
  },
);

export const GetSuggestionsThunk = createAsyncThunk<
  SuggestionsData,
  string,
  { state: RootState; rejectValue: string }
>("search/GetSuggestionsThunk", async (searchTerm, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const data = await fetchSuggestionsAPI(searchTerm);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch suggestions",
      );
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Failed to fetch suggestions");
  }
});

interface ISearchState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  SearchedProducts: SearchedProductsData | null;

  SuggestionsLoading: "idle" | "pending" | "succeeded" | "failed";
  SuggestionsError: string | null;
  Suggestions: SuggestionsData | [];
}

const initialState: ISearchState = {
  loading: "idle",
  error: null,
  SearchedProducts: null,

  SuggestionsLoading: "idle",
  SuggestionsError: null,
  Suggestions: [],
};

const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    ////////////////// SearchedProductsThunk /////////////////////
    builder.addCase(GetSearchedProductsThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetSearchedProductsThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";

      if (action.meta.arg.pageNumber === 1) {
        state.SearchedProducts = action.payload;
      } else {
        state.SearchedProducts = {
          products: [
            ...(state.SearchedProducts?.products ?? []),
            ...action.payload.products,
          ],
          pagination: action.payload.pagination,
        };
      }
    });

    builder.addCase(GetSearchedProductsThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// SuggestionsThunk /////////////////////
    builder.addCase(GetSuggestionsThunk.pending, (state) => {
      state.SuggestionsLoading = "pending";
      state.SuggestionsError = null;
    });
    builder.addCase(GetSuggestionsThunk.fulfilled, (state, action) => {
      state.SuggestionsLoading = "succeeded";
      state.Suggestions = action.payload;
    });

    builder.addCase(GetSuggestionsThunk.rejected, (state, action) => {
      state.SuggestionsLoading = "failed";
      state.SuggestionsError = action.payload as string;
    });
  },
});

export default SearchSlice.reducer;
