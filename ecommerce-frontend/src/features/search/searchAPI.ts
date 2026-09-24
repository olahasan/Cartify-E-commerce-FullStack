import axiosInstance from "@config/api/axios";

/* ----------------------------------------------------
   📌 Searched Products --1
---------------------------------------------------- */
type TPagination = {
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

type TProducts = {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  categoryImage: string | null;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
  productImageUrl: string | null;
};

export type SearchedProductsData = {
  products: TProducts[];
  pagination: TPagination;
};

export type TSearchedProducts = {
  success: boolean;
  message: string;
  data: SearchedProductsData;
  errors: string | null;
};

/* ----------------------------------------------------
   📌 Suggestions Products  --2
---------------------------------------------------- */
type Tsuggestions = {
  suggestionText: string;
};
export type SuggestionsData = Tsuggestions[];
export type TSuggestions = {
  success: boolean;
  message: string;
  data: SuggestionsData;
  errors: string | null;
};

/* ----------------------------------------------------
   📌 API CALL — Searched Products --1
---------------------------------------------------- */
export const fetchSearchedProductsAPI = async (
  searchTerm: string,
  pageNumber = 1,
  pageSize = 20,
): Promise<SearchedProductsData> => {
  try {
    const response = await axiosInstance.get<TSearchedProducts>(
      `/SearchProducts`,
      {
        params: { searchTerm, pageNumber, pageSize },
      },
    );

    return response.data.data;
  } catch {
    throw new Error("Failed to fetch searched products");
  }
};

/* ----------------------------------------------------
   📌 API CALL — Suggestions Products  --2
---------------------------------------------------- */
export const fetchSuggestionsAPI = async (
  searchTerm: string,
): Promise<SuggestionsData> => {
  try {
    const response = await axiosInstance.get<TSuggestions>(
      `/SearchSuggestions`,
      {
        params: {
          searchTerm,
        },
      },
    );

    return response.data.data;
  } catch {
    throw new Error("Failed to fetch search suggestions");
  }
};
