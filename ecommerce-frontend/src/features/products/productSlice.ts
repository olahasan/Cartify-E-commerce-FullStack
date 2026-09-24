import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  fetchProductThumbnails,
  fetchTopRatedProducts,
  fetchFashionImages,
  fetchProductsByCategory,
  fetchHomeSectionsWithSlugs,
  fetchHomePageSections,
  fetchHomeSectionCarousel,
  fetchCategoryNavigationData,
  fetchCategorySidebar,
  fetchProductItems,
  fetchProductImages,
  fetchPagedProducts,
} from "./productAPI";
import axios from "axios";

const handleError = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const getTopRated = createAsyncThunk(
  "products/getTopRated",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const TopRatedProducts = await fetchTopRatedProducts();
      return TopRatedProducts;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  },
);

export const getProductImages = createAsyncThunk(
  "products/getProductImages",
  async (productId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const data = await fetchProductImages(productId);

      return {
        productId,
        images: data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  },
);

export const getProductThumbnails = createAsyncThunk(
  "products/getProductThumbnails",
  async (productId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const ProductThumbnails = await fetchProductThumbnails(productId);
      return {
        productId,
        images: ProductThumbnails,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  },
);

export const getHomeFashionImages = createAsyncThunk(
  "products/getHomeFashionImages",
  async (sectionName: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const FashionImages = await fetchFashionImages(sectionName);
      return FashionImages;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  },
);

export const getProductsByCategory = createAsyncThunk<
  IProductWithCategory[],
  string
>("products/getProductsByCategory", async (slug: string) => {
  const data = await fetchProductsByCategory(slug);
  return data;
});

//pagination
export const getPagedProducts = createAsyncThunk<
  IPagedProducts,
  {
    categoryId: number;
    pageNumber: number;
    pageSize: number;
  },
  { rejectValue: string }
>(
  "products/getPagedProducts",
  async (
    {
      categoryId,
      pageNumber,
      pageSize,
    }: { categoryId: number; pageNumber: number; pageSize: number },
    { rejectWithValue },
  ) => {
    try {
      const data = await fetchPagedProducts(categoryId, pageNumber, pageSize);
      return data;
    } catch (error) {
      return rejectWithValue(
        handleError(
          error,
          `Failed to fetch products data for this category ${categoryId}`,
        ),
      );
    }
  },
);

export const getHomeSectionsWithSlugs = createAsyncThunk(
  "products/getHomeSectionsWithSlugs",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const HomeSectionsWithSlugs = await fetchHomeSectionsWithSlugs();
      return HomeSectionsWithSlugs;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  },
);

// Get dynamic home page sections
export const getHomePageSections = createAsyncThunk<
  IHomePageSections[],
  void,
  { rejectValue: string }
>("products/getHomePageSections", async (_, { rejectWithValue }) => {
  try {
    const HomePageSections = await fetchHomePageSections();
    return HomePageSections;
  } catch (error) {
    return rejectWithValue(
      handleError(error, `Failed to fetch home page sections`),
    );
  }
});

// Get carousel items for a specific section
export const getHomeSectionCarousel = createAsyncThunk<
  { sectionSlug: string; data: IHomeSectionCarousel[] },
  string,
  { rejectValue: string }
>(
  "products/getHomeSectionCarousel",
  async (sectionSlug: string, { rejectWithValue }) => {
    try {
      const data = await fetchHomeSectionCarousel(sectionSlug);
      return { sectionSlug, data };
    } catch (error) {
      return rejectWithValue(
        handleError(error, `Failed to fetch carousel for ${sectionSlug}`),
      );
    }
  },
);

// Get category navigation data
export const getCategoryNavigationData = createAsyncThunk(
  "products/getCategoryNavigationData",
  async (
    {
      slugPath,
      navigationType = "AUTO",
    }: { slugPath: string; navigationType?: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await fetchCategoryNavigationData(slugPath, navigationType);
      return { slugPath, navigationType, data };
    } catch (error) {
      return rejectWithValue(
        handleError(error, `Failed to fetch navigation data for ${slugPath}`),
      );
    }
  },
);

export const getCategorySidebar = createAsyncThunk<
  ICategorySidebar[],
  void,
  { rejectValue: string }
>("products/getCategorySidebar", async (_, { rejectWithValue }) => {
  try {
    const CategorySidebar = await fetchCategorySidebar();
    return CategorySidebar;
  } catch (error) {
    return rejectWithValue(
      handleError(error, `Failed to fetch home page sections`),
    );
  }
});

export const getProductItems = createAsyncThunk<
  IProductItems,
  number,
  { rejectValue: string }
>("products/getProductItems", async (productId: number, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const ProductItems = await fetchProductItems(productId);
    return ProductItems;
  } catch (error) {
    return rejectWithValue(handleError(error, `An unexpected error occurred`));
  }
});

interface IProduct {
  productID: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  imageUrl: string;
}

export interface IProductWithCategory {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  categoryImage: string;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
}

interface IFashionImage {
  displayOrder: number;
  imageUrl: string;
  altText: string;
  sectionName: string;
  slug: string;
}

//pagination
interface IPagination {
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface IProducts {
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
  productImageUrl: string;
}

interface IPagedProducts {
  success: boolean;
  message: string;
  data: {
    products: IProducts[];
    pagination: IPagination;
  };
  errors: unknown | null;
}

interface IHomeSectionsWithSlugs {
  sectionName: string;
  slug: string;
  displayOrder: number;
}

interface IHomePageSections {
  categoryID: number;
  sectionName: string;
  sectionImage: string;
  sectionSlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  showInForAll: boolean;
}

interface IHomeSectionCarousel {
  categoryID: number;
  categoryName: string;
  imageUrl: string;
  categorySlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  parentCategoryID: number;
}

export interface ICategorySidebar {
  categoryID: number;
  categoryName: string;
  categorySlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  showInForAll: boolean;
  parentCategoryID: number | null;
  categoryImageUrl: string | null;
  homepageImageUrl: string | null;
  carouselImageUrl: string | null;
  carouselAltText: string | null;
}

interface IProductItems {
  productID: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  imageUrl: string | null;
}

interface IproductImages {
  [key: number]: {
    thumbs: string[];
    fulls: string[];
  };
}

interface ICategoryInfo {
  categoryID: number;
  name: string;
  imageUrl: string;
  parentCategoryID: number | null;
  slug: string;
  hierarchy: string;
  level: number;
  hasDirectChildren: boolean;
  navigationType: string;
}

interface ICategoryItem {
  categoryID: number;
  name: string;
  imageUrl: string;
  slug: string;
  hierarchy: string;
  level: number;
}

interface IRandomProduct {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantity: number; // ✅ جديد
  rating: number;
  totalReviews: number;
  categoryName: string;
  categorySlug: string;
  imageUrl: string;
}

interface ICategoryNavigationData {
  categoryInfo: ICategoryInfo;
  directChildren: ICategoryItem[];
  categoryProducts: IProductWithCategory[];
  randomProducts: IRandomProduct[];
}

export interface IproductState {
  topRatedProducts: IProduct[];
  topRatedProductsLoading: "idle" | "pending" | "succeeded" | "failed";
  AllFashionImages: Record<string, IFashionImage[]>;
  productsthumbnails: Record<number, string[]>;
  ProductsByCategory: IProductWithCategory[];
  PagedProducts: IPagedProducts | null;
  PagedProductsLoading: "idle" | "pending" | "succeeded" | "failed";
  PagedProductsError: string | null;
  HomeSectionsWithSlugs: IHomeSectionsWithSlugs[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;

  homePageSections: IHomePageSections[];
  homeSectionCarousels: { [sectionSlug: string]: IHomeSectionCarousel[] };
  categoryNavigationData: ICategoryNavigationData | null;

  // Loading states
  homePageSectionsLoading: boolean;
  homeSectionCarouselLoading: { [sectionSlug: string]: boolean };
  categoryNavigationLoading: boolean;

  // Error states
  homePageSectionsError: string | null;
  homeSectionCarouselError: { [sectionSlug: string]: string | null };
  categoryNavigationError: string | null;

  CategorySidebar: ICategorySidebar[];
  CategorySidebarLoading: "idle" | "pending" | "succeeded" | "failed";

  ProductItems: IProductItems | null;

  productImages: IproductImages;
}

const initialState: IproductState = {
  topRatedProducts: [],
  topRatedProductsLoading: "idle",
  AllFashionImages: {},
  productsthumbnails: {},
  ProductsByCategory: [],
  PagedProducts: null,
  PagedProductsLoading: "idle",
  PagedProductsError: null,
  HomeSectionsWithSlugs: [],
  loading: "idle",
  error: null,

  homePageSections: [],
  homeSectionCarousels: {},
  categoryNavigationData: null,

  // Loading states
  homePageSectionsLoading: false,
  homeSectionCarouselLoading: {},
  categoryNavigationLoading: false,

  // Error states
  homePageSectionsError: null,
  homeSectionCarouselError: {},
  categoryNavigationError: null,

  CategorySidebar: [],
  CategorySidebarLoading: "idle",

  ProductItems: null,

  productImages: {},
};

interface RootState {
  product: IproductState;
}

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //////////////////getTopRated/////////////////////
    builder.addCase(getTopRated.pending, (state) => {
      state.topRatedProductsLoading = "pending";
      state.topRatedProducts = [];
      state.error = null;
    });
    builder.addCase(getTopRated.fulfilled, (state, action) => {
      state.topRatedProductsLoading = "succeeded";
      state.topRatedProducts = action.payload;
      state.error = null;
    });
    builder.addCase(getTopRated.rejected, (state, action) => {
      state.topRatedProducts = [];
      state.topRatedProductsLoading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });

    ////////////////// getProductImages /////////////////////
    builder.addCase(getProductImages.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });

    builder.addCase(getProductImages.fulfilled, (state, action) => {
      state.loading = "succeeded";

      const { productId, images } = action.payload;

      state.productImages[productId] = images;
    });

    builder.addCase(getProductImages.rejected, (state, action) => {
      state.loading = "failed";

      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });
    //////////////////getProductThumbnails/////////////////////
    builder.addCase(getProductThumbnails.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(getProductThumbnails.fulfilled, (state, action) => {
      state.loading = "succeeded";
      const { productId, images } = action.payload;
      state.productsthumbnails[productId] = images;
      state.error = null;
    });
    builder.addCase(getProductThumbnails.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });

    //////////////////getWomenFashionImages/////////////////////
    builder.addCase(getHomeFashionImages.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(getHomeFashionImages.fulfilled, (state, action) => {
      state.loading = "succeeded";
      const sectionName = action.meta.arg;
      state.AllFashionImages[sectionName] = action.payload;
      state.error = null;
    });
    builder.addCase(getHomeFashionImages.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });

    //////////////////getProductsByCategory/////////////////////
    builder.addCase(getProductsByCategory.pending, (state) => {
      state.loading = "pending";
      state.ProductsByCategory = [];
      state.error = null;
    });
    builder.addCase(getProductsByCategory.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.ProductsByCategory = action.payload;
    });
    builder.addCase(getProductsByCategory.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });

    //////////////////getPagedProducts/////////////////////
    builder.addCase(getPagedProducts.pending, (state) => {
      state.PagedProductsLoading = "pending";
      state.PagedProductsError = null;
    });
    builder.addCase(getPagedProducts.fulfilled, (state, action) => {
      state.PagedProductsLoading = "succeeded";
      state.PagedProducts = action.payload;
    });
    builder.addCase(getPagedProducts.rejected, (state, action) => {
      state.PagedProductsLoading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.PagedProductsError = action.payload;
      }
    });

    //////////////////getHomeSectionsWithSlugs/////////////////////
    builder.addCase(getHomeSectionsWithSlugs.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(getHomeSectionsWithSlugs.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.HomeSectionsWithSlugs = action.payload;
    });
    builder.addCase(getHomeSectionsWithSlugs.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });

    //////////////////getHomePageSections/////////////////////
    builder.addCase(getHomePageSections.pending, (state) => {
      state.homePageSectionsLoading = true;
      state.homePageSectionsError = null;
    });
    builder.addCase(getHomePageSections.fulfilled, (state, action) => {
      state.homePageSectionsLoading = false;
      state.homePageSections = action.payload;
    });
    builder.addCase(getHomePageSections.rejected, (state, action) => {
      state.homePageSectionsLoading = false;
      state.homePageSectionsError = action.payload as string;
    });

    //////////////////getHomeSectionCarousel/////////////////////
    builder.addCase(getHomeSectionCarousel.pending, (state, action) => {
      const sectionSlug = action.meta.arg;
      state.homeSectionCarouselLoading[sectionSlug] = true;
      state.homeSectionCarouselError[sectionSlug] = null;
    });
    builder.addCase(getHomeSectionCarousel.fulfilled, (state, action) => {
      const { sectionSlug, data } = action.payload;
      state.homeSectionCarouselLoading[sectionSlug] = false;
      state.homeSectionCarousels[sectionSlug] = data;
    });
    builder.addCase(getHomeSectionCarousel.rejected, (state, action) => {
      const sectionSlug = action.meta.arg;
      state.homeSectionCarouselLoading[sectionSlug] = false;
      state.homeSectionCarouselError[sectionSlug] = action.payload as string;
    });

    //////////////////getCategoryNavigationData/////////////////////
    builder.addCase(getCategoryNavigationData.pending, (state) => {
      state.categoryNavigationLoading = true;
      state.categoryNavigationError = null;
    });
    builder.addCase(getCategoryNavigationData.fulfilled, (state, action) => {
      state.categoryNavigationLoading = false;
      state.categoryNavigationData = action.payload.data;
    });
    builder.addCase(getCategoryNavigationData.rejected, (state, action) => {
      state.categoryNavigationLoading = false;
      state.categoryNavigationError = action.payload as string;
    });

    //////////////////getgetCategorySidebar/////////////////////
    builder.addCase(getCategorySidebar.pending, (state) => {
      state.CategorySidebarLoading = "pending";
      state.error = null;
    });
    builder.addCase(getCategorySidebar.fulfilled, (state, action) => {
      state.CategorySidebarLoading = "succeeded";
      state.CategorySidebar = action.payload;
    });
    builder.addCase(getCategorySidebar.rejected, (state, action) => {
      state.CategorySidebarLoading = "failed";
      state.error = action.payload as string;
    });

    //////////////////getProductItems/////////////////////
    builder.addCase(getProductItems.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(getProductItems.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.ProductItems = action.payload;
    });
    builder.addCase(getProductItems.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
  },
});

export default productSlice.reducer;

///////////////////// ✅ Memoized Selectors /////////////////////

export const selectFashionImagesBySection = (sectionName: string) =>
  createSelector(
    (state: RootState) => state.product.AllFashionImages,
    (allImages) => allImages[sectionName] ?? [],
  );
