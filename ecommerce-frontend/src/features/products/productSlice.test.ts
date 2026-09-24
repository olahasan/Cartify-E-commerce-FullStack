import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import productReducer, {
  getCategoryNavigationData,
  getCategorySidebar,
  getHomeFashionImages,
  getHomePageSections,
  getHomeSectionCarousel,
  getHomeSectionsWithSlugs,
  getPagedProducts,
  getProductImages,
  getProductItems,
  getProductsByCategory,
  getProductThumbnails,
  getTopRated,
} from "./productSlice";

import * as ProductAPI from "./productAPI";

vi.mock("./productAPI", () => ({
  fetchTopRatedProducts: vi.fn(),
  fetchProductImages: vi.fn(),
  fetchProductThumbnails: vi.fn(),
  fetchFashionImages: vi.fn(),
  fetchProductsByCategory: vi.fn(),
  fetchPagedProducts: vi.fn(),
  fetchHomeSectionsWithSlugs: vi.fn(),
  fetchHomePageSections: vi.fn(),
  fetchHomeSectionCarousel: vi.fn(),
  fetchCategoryNavigationData: vi.fn(),
  fetchCategorySidebar: vi.fn(),
  fetchProductItems: vi.fn(),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      product: productReducer,
    },
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Product Async Thunks", () => {
  describe("getTopRated", () => {
    it("should get top rated products successfully", async () => {
      const mockProducts = [
        {
          productID: 1,
          name: "Test Product",
          description: "Test Description",
          price: 100,
          quantity: 5,
          rating: 4.8,
          totalReviews: 20,
          imageUrl: "test.jpg",
        },
      ];

      vi.mocked(ProductAPI.fetchTopRatedProducts).mockResolvedValue(
        mockProducts,
      );

      const store = createTestStore();

      const result = await store.dispatch(getTopRated());

      expect(result.type).toBe("products/getTopRated/fulfilled");

      expect(ProductAPI.fetchTopRatedProducts).toHaveBeenCalledTimes(1);

      expect(store.getState().product.topRatedProducts).toEqual(mockProducts);

      expect(store.getState().product.topRatedProductsLoading).toBe(
        "succeeded",
      );

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching top rated products fails", async () => {
      vi.mocked(ProductAPI.fetchTopRatedProducts).mockRejectedValue(
        new Error("Failed to fetch top rated products"),
      );

      const store = createTestStore();

      const result = await store.dispatch(getTopRated());

      expect(result.type).toBe("products/getTopRated/rejected");

      expect(ProductAPI.fetchTopRatedProducts).toHaveBeenCalledTimes(1);

      expect(store.getState().product.topRatedProducts).toEqual([]);

      expect(store.getState().product.topRatedProductsLoading).toBe("failed");

      expect(store.getState().product.error).toBe(
        "An unexpected error occurred.",
      );
    });
  });

  describe("getProductImages", () => {
    it("should get product images successfully", async () => {
      const mockImages = {
        thumbs: ["thumb1.jpg", "thumb2.jpg"],
        fulls: ["full1.jpg", "full2.jpg"],
      };

      vi.mocked(ProductAPI.fetchProductImages).mockResolvedValue(mockImages);

      const store = createTestStore();

      const result = await store.dispatch(getProductImages(10));

      expect(result.type).toBe("products/getProductImages/fulfilled");

      expect(ProductAPI.fetchProductImages).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductImages).toHaveBeenCalledWith(10);

      expect(store.getState().product.productImages[10]).toEqual(mockImages);

      expect(store.getState().product.loading).toBe("succeeded");

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching product images fails", async () => {
      vi.mocked(ProductAPI.fetchProductImages).mockRejectedValue(
        new Error("Failed to fetch product images"),
      );

      const store = createTestStore();

      const result = await store.dispatch(getProductImages(10));

      expect(result.type).toBe("products/getProductImages/rejected");

      expect(ProductAPI.fetchProductImages).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductImages).toHaveBeenCalledWith(10);

      expect(store.getState().product.loading).toBe("failed");

      expect(store.getState().product.error).toBe(
        "An unexpected error occurred.",
      );
    });
  });

  describe("getProductThumbnails", () => {
    it("should get product thumbnails successfully", async () => {
      const mockThumbnails = ["thumb1.jpg", "thumb2.jpg", "thumb3.jpg"];

      vi.mocked(ProductAPI.fetchProductThumbnails).mockResolvedValue(
        mockThumbnails,
      );

      const store = createTestStore();

      const result = await store.dispatch(getProductThumbnails(10));

      expect(result.type).toBe("products/getProductThumbnails/fulfilled");

      expect(ProductAPI.fetchProductThumbnails).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductThumbnails).toHaveBeenCalledWith(10);

      expect(store.getState().product.productsthumbnails[10]).toEqual(
        mockThumbnails,
      );

      expect(store.getState().product.loading).toBe("succeeded");

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching product thumbnails fails", async () => {
      vi.mocked(ProductAPI.fetchProductThumbnails).mockRejectedValue(
        new Error("Failed to fetch product thumbnails"),
      );

      const store = createTestStore();

      const result = await store.dispatch(getProductThumbnails(10));

      expect(result.type).toBe("products/getProductThumbnails/rejected");

      expect(ProductAPI.fetchProductThumbnails).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductThumbnails).toHaveBeenCalledWith(10);

      expect(store.getState().product.loading).toBe("failed");

      expect(store.getState().product.error).toBe(
        "An unexpected error occurred.",
      );
    });
  });

  describe("getHomeFashionImages", () => {
    it("should get home fashion images successfully", async () => {
      const mockFashionImages = [
        {
          displayOrder: 1,
          imageUrl: "fashion1.jpg",
          altText: "Fashion Image 1",
          sectionName: "Women Fashion",
          slug: "women-fashion",
        },
        {
          displayOrder: 2,
          imageUrl: "fashion2.jpg",
          altText: "Fashion Image 2",
          sectionName: "Women Fashion",
          slug: "women-fashion",
        },
      ];

      vi.mocked(ProductAPI.fetchFashionImages).mockResolvedValue(
        mockFashionImages,
      );

      const store = createTestStore();

      const result = await store.dispatch(
        getHomeFashionImages("Women Fashion"),
      );

      expect(result.type).toBe("products/getHomeFashionImages/fulfilled");

      expect(ProductAPI.fetchFashionImages).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchFashionImages).toHaveBeenCalledWith(
        "Women Fashion",
      );

      expect(
        store.getState().product.AllFashionImages["Women Fashion"],
      ).toEqual(mockFashionImages);

      expect(store.getState().product.loading).toBe("succeeded");

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching home fashion images fails", async () => {
      vi.mocked(ProductAPI.fetchFashionImages).mockRejectedValue(
        new Error("Failed to fetch home fashion images"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        getHomeFashionImages("Women Fashion"),
      );

      expect(result.type).toBe("products/getHomeFashionImages/rejected");

      expect(ProductAPI.fetchFashionImages).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchFashionImages).toHaveBeenCalledWith(
        "Women Fashion",
      );

      expect(store.getState().product.loading).toBe("failed");

      expect(store.getState().product.error).toBe(
        "An unexpected error occurred.",
      );
    });
  });

  describe("getProductsByCategory", () => {
    it("should get products by category successfully", async () => {
      const mockProducts = [
        {
          productID: 1,
          productName: "Test Product",
          description: "Test Description",
          price: 100,
          quantity: 5,
          rating: 4.5,
          totalReviews: 20,
          categoryImage: "category.jpg",
          categoryName: "Electronics",
          categorySlug: "electronics",
          createdAt: "2026-08-14T10:00:00Z",
          updatedAt: "2026-08-14T10:00:00Z",
        },
      ];

      vi.mocked(ProductAPI.fetchProductsByCategory).mockResolvedValue(
        mockProducts,
      );

      const store = createTestStore();

      const result = await store.dispatch(getProductsByCategory("electronics"));

      expect(result.type).toBe("products/getProductsByCategory/fulfilled");

      expect(ProductAPI.fetchProductsByCategory).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductsByCategory).toHaveBeenCalledWith(
        "electronics",
      );

      expect(store.getState().product.ProductsByCategory).toEqual(mockProducts);

      expect(store.getState().product.loading).toBe("succeeded");

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching products by category fails", async () => {
      vi.mocked(ProductAPI.fetchProductsByCategory).mockRejectedValue(
        new Error("Failed to fetch products by category"),
      );

      const store = createTestStore();

      const result = await store.dispatch(getProductsByCategory("electronics"));

      expect(result.type).toBe("products/getProductsByCategory/rejected");

      expect(ProductAPI.fetchProductsByCategory).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductsByCategory).toHaveBeenCalledWith(
        "electronics",
      );

      expect(store.getState().product.loading).toBe("failed");

      expect(store.getState().product.ProductsByCategory).toEqual([]);

      expect(store.getState().product.error).toBeNull();
    });
  });

  describe("getPagedProducts", () => {
    it("should get paged products successfully", async () => {
      const mockPagedProducts = {
        success: true,
        message: "Products fetched successfully",
        data: {
          products: [
            {
              productID: 1,
              productName: "Test Product",
              description: "Test Description",
              price: 100,
              quantity: 5,
              rating: 4.5,
              totalReviews: 20,
              categoryImage: null,
              categoryName: "Test Category",
              categorySlug: "test-category",
              createdAt: "2026-08-15T00:00:00.000Z",
              updatedAt: "2026-08-15T00:00:00.000Z",
              productImageUrl: "test.jpg",
            },
          ],
          pagination: {
            totalItems: 1,
            totalPages: 1,
            currentPage: 1,
            pageSize: 10,
            totalProducts: 1,
            hasPreviousPage: false,
            hasNextPage: false,
          },
        },
        errors: null,
      };

      vi.mocked(ProductAPI.fetchPagedProducts).mockResolvedValue(
        mockPagedProducts,
      );

      const store = createTestStore();

      const result = await store.dispatch(
        getPagedProducts({
          categoryId: 5,
          pageNumber: 1,
          pageSize: 10,
        }),
      );

      expect(result.type).toBe("products/getPagedProducts/fulfilled");

      expect(ProductAPI.fetchPagedProducts).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchPagedProducts).toHaveBeenCalledWith(5, 1, 10);

      expect(store.getState().product.PagedProducts).toEqual(mockPagedProducts);

      expect(store.getState().product.PagedProductsLoading).toBe("succeeded");

      expect(store.getState().product.PagedProductsError).toBeNull();
    });

    it("should fail when fetching paged products fails", async () => {
      vi.mocked(ProductAPI.fetchPagedProducts).mockRejectedValue(
        new Error("Failed to fetch paged products"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        getPagedProducts({
          categoryId: 5,
          pageNumber: 1,
          pageSize: 10,
        }),
      );

      expect(result.type).toBe("products/getPagedProducts/rejected");

      expect(ProductAPI.fetchPagedProducts).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchPagedProducts).toHaveBeenCalledWith(5, 1, 10);

      expect(store.getState().product.PagedProductsLoading).toBe("failed");

      expect(store.getState().product.PagedProductsError).toBe(
        "Failed to fetch paged products",
      );
    });
  });

  describe("getHomeSectionsWithSlugs", () => {
    it("should get home sections with slugs successfully", async () => {
      const mockSections = [
        {
          sectionName: "Women Fashion",
          slug: "women-fashion",
          displayOrder: 1,
        },
        {
          sectionName: "Men Fashion",
          slug: "men-fashion",
          displayOrder: 2,
        },
      ];

      vi.mocked(ProductAPI.fetchHomeSectionsWithSlugs).mockResolvedValue(
        mockSections,
      );

      const store = createTestStore();

      const result = await store.dispatch(getHomeSectionsWithSlugs());

      expect(result.type).toBe("products/getHomeSectionsWithSlugs/fulfilled");

      expect(ProductAPI.fetchHomeSectionsWithSlugs).toHaveBeenCalledTimes(1);

      expect(store.getState().product.HomeSectionsWithSlugs).toEqual(
        mockSections,
      );

      expect(store.getState().product.loading).toBe("succeeded");

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching home sections with slugs fails", async () => {
      const error = new Error("Failed to fetch home sections");

      vi.mocked(ProductAPI.fetchHomeSectionsWithSlugs).mockRejectedValue(error);

      const store = createTestStore();

      const result = await store.dispatch(getHomeSectionsWithSlugs());

      expect(result.type).toBe("products/getHomeSectionsWithSlugs/rejected");

      expect(ProductAPI.fetchHomeSectionsWithSlugs).toHaveBeenCalledTimes(1);

      expect(store.getState().product.loading).toBe("failed");
    });
  });

  describe("getHomePageSections", () => {
    it("should get home page sections successfully", async () => {
      const mockSections = [
        {
          categoryID: 1,
          sectionName: "Women Fashion",
          sectionImage: "women.jpg",
          sectionSlug: "women-fashion",
          hierarchy: "1",
          level: 1,
          showInHome: true,
          showInForAll: true,
        },
      ];

      vi.mocked(ProductAPI.fetchHomePageSections).mockResolvedValue(
        mockSections,
      );

      const store = createTestStore();

      const result = await store.dispatch(getHomePageSections());

      expect(result.type).toBe("products/getHomePageSections/fulfilled");

      expect(ProductAPI.fetchHomePageSections).toHaveBeenCalledTimes(1);

      expect(store.getState().product.homePageSections).toEqual(mockSections);

      expect(store.getState().product.homePageSectionsLoading).toBe(false);

      expect(store.getState().product.homePageSectionsError).toBeNull();
    });

    it("should fail when fetching home page sections fails", async () => {
      vi.mocked(ProductAPI.fetchHomePageSections).mockRejectedValue(
        new Error("Failed to fetch home page sections"),
      );

      const store = createTestStore();

      const result = await store.dispatch(getHomePageSections());

      expect(result.type).toBe("products/getHomePageSections/rejected");

      expect(ProductAPI.fetchHomePageSections).toHaveBeenCalledTimes(1);

      expect(store.getState().product.homePageSectionsLoading).toBe(false);

      expect(store.getState().product.homePageSectionsError).toBe(
        "Failed to fetch home page sections",
      );
    });
  });

  describe("getHomeSectionCarousel", () => {
    it("should get home section carousel successfully", async () => {
      const mockCarousel = [
        {
          categoryID: 1,
          categoryName: "Women Fashion",
          imageUrl: "fashion.jpg",
          categorySlug: "women-fashion",
          hierarchy: "1",
          level: 1,
          showInHome: true,
          parentCategoryID: 0,
        },
      ];

      const sectionSlug = "women-fashion";

      vi.mocked(ProductAPI.fetchHomeSectionCarousel).mockResolvedValue(
        mockCarousel,
      );

      const store = createTestStore();

      const result = await store.dispatch(getHomeSectionCarousel(sectionSlug));

      expect(result.type).toBe("products/getHomeSectionCarousel/fulfilled");

      expect(ProductAPI.fetchHomeSectionCarousel).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchHomeSectionCarousel).toHaveBeenCalledWith(
        sectionSlug,
      );

      expect(
        store.getState().product.homeSectionCarousels[sectionSlug],
      ).toEqual(mockCarousel);

      expect(
        store.getState().product.homeSectionCarouselLoading[sectionSlug],
      ).toBe(false);

      expect(
        store.getState().product.homeSectionCarouselError[sectionSlug],
      ).toBeNull();
    });

    it("should fail when fetching home section carousel fails", async () => {
      vi.mocked(ProductAPI.fetchHomeSectionCarousel).mockRejectedValue(
        new Error("Failed to fetch carousel"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        getHomeSectionCarousel("women-fashion"),
      );

      expect(result.type).toBe("products/getHomeSectionCarousel/rejected");

      expect(ProductAPI.fetchHomeSectionCarousel).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchHomeSectionCarousel).toHaveBeenCalledWith(
        "women-fashion",
      );

      expect(
        store.getState().product.homeSectionCarouselLoading["women-fashion"],
      ).toBe(false);

      expect(
        store.getState().product.homeSectionCarouselError["women-fashion"],
      ).toBe("Failed to fetch carousel");
    });
  });

  describe("getCategoryNavigationData", () => {
    it("should get category navigation data successfully", async () => {
      const mockNavigationData = {
        categoryInfo: {
          categoryID: 1,
          name: "Electronics",
          imageUrl: "electronics.jpg",
          parentCategoryID: null,
          slug: "electronics",
          hierarchy: "1",
          level: 1,
          hasDirectChildren: true,
          navigationType: "AUTO",
        },

        directChildren: [
          {
            categoryID: 2,
            name: "Laptops",
            imageUrl: "laptops.jpg",
            slug: "laptops",
            hierarchy: "1.1",
            level: 2,
          },
        ],

        categoryProducts: [
          {
            productID: 1,
            productName: "Test Laptop",
            description: "Test Description",
            price: 1000,
            quantity: 5,
            rating: 4.5,
            totalReviews: 20,
            categoryImage: "electronics.jpg",
            categoryName: "Electronics",
            categorySlug: "electronics",
            createdAt: "2026-08-15T00:00:00.000Z",
            updatedAt: "2026-08-15T00:00:00.000Z",
          },
        ],

        randomProducts: [
          {
            productID: 2,
            productName: "Random Product",
            description: "Random Description",
            price: 500,
            quantity: 10,
            rating: 4.2,
            totalReviews: 15,
            categoryName: "Electronics",
            categorySlug: "electronics",
            imageUrl: "random.jpg",
          },
        ],
      };

      const slugPath = "electronics";
      const navigationType = "AUTO";

      vi.mocked(ProductAPI.fetchCategoryNavigationData).mockResolvedValue(
        mockNavigationData,
      );

      const store = createTestStore();

      const result = await store.dispatch(
        getCategoryNavigationData({
          slugPath,
          navigationType,
        }),
      );

      expect(result.type).toBe("products/getCategoryNavigationData/fulfilled");

      expect(ProductAPI.fetchCategoryNavigationData).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchCategoryNavigationData).toHaveBeenCalledWith(
        slugPath,
        navigationType,
      );

      expect(store.getState().product.categoryNavigationData).toEqual(
        mockNavigationData,
      );

      expect(store.getState().product.categoryNavigationLoading).toBe(false);

      expect(store.getState().product.categoryNavigationError).toBeNull();
    });

    it("should fail when fetching category navigation data fails", async () => {
      vi.mocked(ProductAPI.fetchCategoryNavigationData).mockRejectedValue(
        new Error("Failed to fetch category navigation data"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        getCategoryNavigationData({
          slugPath: "electronics",
          navigationType: "AUTO",
        }),
      );

      expect(result.type).toBe("products/getCategoryNavigationData/rejected");

      expect(ProductAPI.fetchCategoryNavigationData).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchCategoryNavigationData).toHaveBeenCalledWith(
        "electronics",
        "AUTO",
      );

      expect(store.getState().product.categoryNavigationLoading).toBe(false);

      expect(store.getState().product.categoryNavigationError).toBe(
        "Failed to fetch category navigation data",
      );
    });
  });

  describe("getCategorySidebar", () => {
    it("should get category sidebar successfully", async () => {
      const mockCategorySidebar = [
        {
          categoryID: 1,
          categoryName: "Women Fashion",
          categorySlug: "women-fashion",
          hierarchy: "1",
          level: 1,
          showInHome: true,
          showInForAll: true,
          parentCategoryID: null,
          categoryImageUrl: "category.jpg",
          homepageImageUrl: "home.jpg",
          carouselImageUrl: "carousel.jpg",
          carouselAltText: "Women Fashion",
        },
      ];

      vi.mocked(ProductAPI.fetchCategorySidebar).mockResolvedValue(
        mockCategorySidebar,
      );

      const store = createTestStore();

      const result = await store.dispatch(getCategorySidebar());

      expect(result.type).toBe("products/getCategorySidebar/fulfilled");

      expect(ProductAPI.fetchCategorySidebar).toHaveBeenCalledTimes(1);

      expect(store.getState().product.CategorySidebar).toEqual(
        mockCategorySidebar,
      );

      expect(store.getState().product.CategorySidebarLoading).toBe("succeeded");

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching category sidebar fails", async () => {
      vi.mocked(ProductAPI.fetchCategorySidebar).mockRejectedValue(
        new Error("Failed to fetch category sidebar"),
      );

      const store = createTestStore();

      const result = await store.dispatch(getCategorySidebar());

      expect(result.type).toBe("products/getCategorySidebar/rejected");

      expect(ProductAPI.fetchCategorySidebar).toHaveBeenCalledTimes(1);

      expect(store.getState().product.CategorySidebarLoading).toBe("failed");

      expect(store.getState().product.error).toBe(
        "Failed to fetch category sidebar",
      );
    });
  });

  describe("getProductItems", () => {
    it("should get product items successfully", async () => {
      const mockProductItems = {
        productID: 1,
        name: "Test Product",
        description: "Test Description",
        price: 100,
        quantity: 5,
        rating: 4.5,
        totalReviews: 20,
        imageUrl: "product.jpg",
      };

      vi.mocked(ProductAPI.fetchProductItems).mockResolvedValue(
        mockProductItems,
      );

      const store = createTestStore();

      const result = await store.dispatch(getProductItems(1));

      expect(result.type).toBe("products/getProductItems/fulfilled");

      expect(ProductAPI.fetchProductItems).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductItems).toHaveBeenCalledWith(1);

      expect(store.getState().product.ProductItems).toEqual(mockProductItems);

      expect(store.getState().product.loading).toBe("succeeded");

      expect(store.getState().product.error).toBeNull();
    });

    it("should fail when fetching product items fails", async () => {
      vi.mocked(ProductAPI.fetchProductItems).mockRejectedValue(
        new Error("Failed to fetch product items"),
      );

      const store = createTestStore();

      const result = await store.dispatch(getProductItems(1));

      expect(result.type).toBe("products/getProductItems/rejected");

      expect(ProductAPI.fetchProductItems).toHaveBeenCalledTimes(1);

      expect(ProductAPI.fetchProductItems).toHaveBeenCalledWith(1);

      expect(store.getState().product.loading).toBe("failed");

      expect(store.getState().product.error).toBe(
        "Failed to fetch product items",
      );
    });
  });
});
