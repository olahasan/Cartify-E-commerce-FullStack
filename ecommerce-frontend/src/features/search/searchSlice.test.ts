import { describe, expect, it, vi, beforeEach } from "vitest";
import searchReducer, {
  GetSearchedProductsThunk,
  GetSuggestionsThunk,
} from "./SearchSlice";

import { fetchSearchedProductsAPI, fetchSuggestionsAPI } from "./searchAPI";

vi.mock("./searchAPI", () => ({
  fetchSearchedProductsAPI: vi.fn(),
  fetchSuggestionsAPI: vi.fn(),
}));

const mockedFetchSearchedProductsAPI = vi.mocked(fetchSearchedProductsAPI);
const mockedFetchSuggestionsAPI = vi.mocked(fetchSuggestionsAPI);

const searchedProductsResponse = {
  products: [
    {
      productID: 1,
      productName: "Laptop",
      description: "Test Laptop",
      price: 1000,
      quantity: 5,
      rating: 4.5,
      totalReviews: 20,
      categoryImage: null,
      categoryName: "Electronics",
      categorySlug: "electronics",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
      productImageUrl: null,
    },
    {
      productID: 2,
      productName: "Laptop Bag",
      description: "Test Laptop Bag",
      price: 50,
      quantity: 10,
      rating: 4,
      totalReviews: 10,
      categoryImage: null,
      categoryName: "Accessories",
      categorySlug: "accessories",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
      productImageUrl: null,
    },
  ],
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalProducts: 2,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  },
};

const secondPageResponse = {
  products: [
    {
      productID: 3,
      productName: "Laptop Stand",
      description: "Test Laptop Stand",
      price: 30,
      quantity: 8,
      rating: 4.2,
      totalReviews: 5,
      categoryImage: null,
      categoryName: "Accessories",
      categorySlug: "accessories",
      createdAt: "2026-01-02",
      updatedAt: "2026-01-02",
      productImageUrl: null,
    },
  ],
  pagination: {
    currentPage: 2,
    pageSize: 20,
    totalProducts: 3,
    totalPages: 2,
    hasPreviousPage: true,
    hasNextPage: false,
  },
};

const suggestionsResponse = [
  {
    suggestionText: "Laptop",
  },
  {
    suggestionText: "Laptop Bag",
  },
  {
    suggestionText: "Laptop Stand",
  },
];

describe("Search Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the initial state", () => {
    const state = searchReducer(undefined, { type: "unknown" });

    expect(state.loading).toBe("idle");
    expect(state.error).toBeNull();
    expect(state.SearchedProducts).toBeNull();

    expect(state.SuggestionsLoading).toBe("idle");
    expect(state.SuggestionsError).toBeNull();
    expect(state.Suggestions).toEqual([]);
  });

  it("should set loading to pending when searching products", () => {
    const state = searchReducer(
      undefined,
      GetSearchedProductsThunk.pending("request-id", {
        searchTerm: "laptop",
        pageNumber: 1,
        pageSize: 20,
      }),
    );

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store searched products when fetching page 1 succeeds", () => {
    const state = searchReducer(
      undefined,
      GetSearchedProductsThunk.fulfilled(
        searchedProductsResponse,
        "request-id",
        {
          searchTerm: "laptop",
          pageNumber: 1,
          pageSize: 20,
        },
      ),
    );

    expect(state.loading).toBe("succeeded");
    expect(state.SearchedProducts).toEqual(searchedProductsResponse);
  });

  it("should append products when fetching a later page", () => {
    const previousState = {
      loading: "succeeded" as const,
      error: null,
      SearchedProducts: searchedProductsResponse,

      SuggestionsLoading: "idle" as const,
      SuggestionsError: null,
      Suggestions: [],
    };

    const state = searchReducer(
      previousState,
      GetSearchedProductsThunk.fulfilled(secondPageResponse, "request-id", {
        searchTerm: "laptop",
        pageNumber: 2,
        pageSize: 20,
      }),
    );

    expect(state.loading).toBe("succeeded");

    expect(state.SearchedProducts?.products).toHaveLength(3);

    expect(state.SearchedProducts?.products[0].productID).toBe(1);
    expect(state.SearchedProducts?.products[1].productID).toBe(2);
    expect(state.SearchedProducts?.products[2].productID).toBe(3);

    expect(state.SearchedProducts?.pagination).toEqual(
      secondPageResponse.pagination,
    );
  });

  it("should store the error when searching products fails", () => {
    const state = searchReducer(
      undefined,
      GetSearchedProductsThunk.rejected(
        new Error("Search failed"),
        "request-id",
        {
          searchTerm: "laptop",
          pageNumber: 1,
          pageSize: 20,
        },
        "Failed to fetch search results",
      ),
    );

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to fetch search results");
  });

  it("should set SuggestionsLoading to pending", () => {
    const state = searchReducer(
      undefined,
      GetSuggestionsThunk.pending("request-id", "laptop"),
    );

    expect(state.SuggestionsLoading).toBe("pending");
    expect(state.SuggestionsError).toBeNull();
  });

  it("should store suggestions when fetching succeeds", () => {
    const state = searchReducer(
      undefined,
      GetSuggestionsThunk.fulfilled(
        suggestionsResponse,
        "request-id",
        "laptop",
      ),
    );

    expect(state.SuggestionsLoading).toBe("succeeded");
    expect(state.Suggestions).toEqual(suggestionsResponse);
  });

  it("should store the error when fetching suggestions fails", () => {
    const state = searchReducer(
      undefined,
      GetSuggestionsThunk.rejected(
        new Error("Suggestions failed"),
        "request-id",
        "laptop",
        "Failed to fetch suggestions",
      ),
    );

    expect(state.SuggestionsLoading).toBe("failed");
    expect(state.SuggestionsError).toBe("Failed to fetch suggestions");
  });

  it("should fetch searched products successfully", async () => {
    mockedFetchSearchedProductsAPI.mockResolvedValue(searchedProductsResponse);

    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await GetSearchedProductsThunk({
      searchTerm: "laptop",
      pageNumber: 1,
      pageSize: 20,
    })(dispatch, getState, undefined);

    expect(result.type).toBe("search/GetSearchedProductsThunk/fulfilled");

    expect(result.payload).toEqual(searchedProductsResponse);

    expect(mockedFetchSearchedProductsAPI).toHaveBeenCalledWith(
      "laptop",
      1,
      20,
    );
  });

  it("should reject when searching products API fails", async () => {
    mockedFetchSearchedProductsAPI.mockRejectedValue(
      new Error("Failed to fetch searched products"),
    );

    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await GetSearchedProductsThunk({
      searchTerm: "laptop",
      pageNumber: 1,
      pageSize: 20,
    })(dispatch, getState, undefined);

    expect(result.type).toBe("search/GetSearchedProductsThunk/rejected");

    expect(result.payload).toBe("Failed to fetch searched products");

    expect(result.meta.requestStatus).toBe("rejected");
  });

  it("should fetch suggestions successfully", async () => {
    mockedFetchSuggestionsAPI.mockResolvedValue(suggestionsResponse);

    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await GetSuggestionsThunk("laptop")(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("search/GetSuggestionsThunk/fulfilled");

    expect(result.payload).toEqual(suggestionsResponse);

    expect(mockedFetchSuggestionsAPI).toHaveBeenCalledWith("laptop");
  });

  it("should reject when suggestions API fails", async () => {
    mockedFetchSuggestionsAPI.mockRejectedValue(
      new Error("Failed to fetch search suggestions"),
    );

    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await GetSuggestionsThunk("laptop")(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("search/GetSuggestionsThunk/rejected");

    expect(result.payload).toBe("Failed to fetch search suggestions");

    expect(result.meta.requestStatus).toBe("rejected");
  });
});
