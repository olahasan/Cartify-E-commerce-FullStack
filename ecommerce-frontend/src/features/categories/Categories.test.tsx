// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from "vitest";

// /**
//  * @vitest-environment jsdom
//  */

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Categories from "./Categories";

import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  getCategoryNavigationData,
  getPagedProducts,
  // type IproductState,
} from "@products/productSlice";

vi.mock("@app/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("@products/productSlice", () => ({
  getCategoryNavigationData: vi.fn(),
  getPagedProducts: vi.fn(),
}));

vi.mock("./Components/Breadcrumb", () => ({
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

vi.mock("./Components/CategoryHeader", () => ({
  default: () => <div data-testid="category-header">Category Header</div>,
}));

vi.mock("./Components/SubCategoryGrid", () => ({
  default: () => <div data-testid="subcategory-grid">Subcategories</div>,
}));

vi.mock("./Components/ProductGrid", () => ({
  default: () => <div data-testid="product-grid">Products</div>,
}));

vi.mock("./Components/FeaturedProducts", () => ({
  default: () => <div data-testid="featured-products">Featured Products</div>,
}));

vi.mock("./Components/CategorySidebar", () => ({
  default: () => <div data-testid="category-sidebar">Sidebar</div>,
}));

vi.mock("./Components/AllCategoriesGrid ", () => ({
  default: () => <div data-testid="all-categories-grid">All Categories</div>,
}));

vi.mock("./Skeleton/CategoryHeaderSkeleton", () => ({
  default: () => <div data-testid="category-header-skeleton" />,
}));

vi.mock("./Skeleton/SubCategoryGridSkeleton", () => ({
  default: () => <div data-testid="subcategory-skeleton" />,
}));

vi.mock("./Skeleton/BreadcrumbSkeleton", () => ({
  default: () => <div data-testid="breadcrumb-skeleton" />,
}));

vi.mock("./Skeleton/FeaturedProductsSkeleton", () => ({
  default: () => <div data-testid="featured-skeleton" />,
}));

vi.mock("./Skeleton/CategorySidebarSkeleton", () => ({
  default: () => <div data-testid="sidebar-skeleton" />,
}));

vi.mock("@shared/Skeletons/ProductGridSkeleton", () => ({
  default: () => <div data-testid="product-skeleton" />,
}));

vi.mock("@shared/BackToTop/BackToTop", () => ({
  default: () => <div data-testid="back-to-top" />,
}));

vi.mock("@shared/LottieHandler/LottieHandler", () => ({
  default: () => <div data-testid="lottie-handler" />,
}));

const mockedDispatch = vi.fn();

const mockCategoryNavigationData = {
  categoryInfo: {
    categoryID: 10,
    name: "Electronics",
    imageUrl: "/electronics.jpg",
    hasDirectChildren: true,
    hierarchy: [
      {
        name: "Electronics",
        slug: "electronics",
      },
    ],
  },

  directChildren: [
    {
      categoryID: 11,
      name: "Laptops",
      slug: "laptops",
      imageUrl: "/laptops.jpg",
    },
  ],

  randomProducts: [
    {
      productID: 1,
      productName: "Laptop",
      description: "Test laptop",
      price: 1000,
      quantity: 5,
      rating: 4.5,
      totalReviews: 10,
      imageUrl: "/laptop.jpg",
    },
  ],
};

const mockPagedProducts = {
  data: {
    products: [
      {
        productID: 1,
        productName: "Laptop",
        description: "Test laptop",
        price: 1000,
        quantity: 5,
        rating: 4.5,
        totalReviews: 10,
        imageUrl: "/laptop.jpg",
      },
    ],

    pagination: {
      currentPage: 1,
      pageSize: 4,
      totalProducts: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
};

const renderCategories = (initialRoute = "/categories") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Categories />
    </MemoryRouter>,
  );
};

type MockProductState = {
  categoryNavigationData: typeof mockCategoryNavigationData | null;
  categoryNavigationLoading: boolean;
  categoryNavigationError: string | null;
  PagedProducts: typeof mockPagedProducts | null;
  PagedProductsLoading: "idle" | "pending" | "succeeded" | "failed";
};

const defaultProductState: MockProductState = {
  categoryNavigationData: null,
  categoryNavigationLoading: false,
  categoryNavigationError: null,
  PagedProducts: null,
  PagedProductsLoading: "idle",
};

let mockProductState: MockProductState = defaultProductState;

describe("Categories Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockProductState = defaultProductState;

    vi.mocked(useAppDispatch).mockReturnValue(mockedDispatch);

    vi.mocked(useAppSelector).mockImplementation((selector) =>
      selector({
        product: mockProductState,
      } as never),
    );

    vi.mocked(getCategoryNavigationData).mockReturnValue({
      type: "product/getCategoryNavigationData",
    } as never);

    vi.mocked(getPagedProducts).mockReturnValue({
      type: "product/getPagedProducts",
    } as never);
  });
  it("should render all categories when no category path exists", () => {
    renderCategories("/categories");

    expect(screen.getByTestId("all-categories-grid")).toBeInTheDocument();

    expect(screen.getByTestId("category-sidebar")).toBeInTheDocument();

    expect(getCategoryNavigationData).not.toHaveBeenCalled();
  });

  it("should render skeletons while category data is loading", () => {
    mockProductState = {
      ...defaultProductState,
      categoryNavigationLoading: true,
    };

    renderCategories("/categories/electronics");

    expect(screen.getByTestId("category-header-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("product-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("featured-skeleton")).toBeInTheDocument();
  });

  it("should render category error when loading category fails", () => {
    mockProductState = {
      ...defaultProductState,
      categoryNavigationError: "Failed to load category",
    };
    renderCategories("/categories/electronics");

    expect(
      screen.getByText("Error: Failed to load category"),
    ).toBeInTheDocument();
  });

  it("should dispatch category navigation when category path exists", async () => {
    renderCategories("/categories/electronics");

    await waitFor(() => {
      expect(getCategoryNavigationData).toHaveBeenCalledWith({
        slugPath: "electronics",
        navigationType: "AUTO",
      });
    });

    expect(mockedDispatch).toHaveBeenCalled();
  });

  it("should render subcategories when category has direct children", () => {
    mockProductState = {
      ...defaultProductState,
      categoryNavigationData: mockCategoryNavigationData,
      categoryNavigationLoading: false,
    };
    renderCategories("/categories/electronics");

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("category-header")).toBeInTheDocument();

    expect(screen.getByTestId("subcategory-grid")).toBeInTheDocument();

    expect(screen.queryByTestId("product-grid")).not.toBeInTheDocument();
  });

  it("should render products when category has no direct children", () => {
    mockProductState = {
      ...defaultProductState,

      categoryNavigationData: {
        ...mockCategoryNavigationData,

        categoryInfo: {
          ...mockCategoryNavigationData.categoryInfo,
          hasDirectChildren: false,
        },

        directChildren: [],
      },

      PagedProducts: mockPagedProducts,
      categoryNavigationLoading: false,
      PagedProductsLoading: "succeeded",
    };

    renderCategories("/categories/electronics");

    expect(screen.getByTestId("product-grid")).toBeInTheDocument();

    expect(screen.getByText("Our Products")).toBeInTheDocument();
  });

  it("should show empty state when no products match filters", () => {
    mockProductState = {
      ...defaultProductState,

      categoryNavigationData: {
        ...mockCategoryNavigationData,

        categoryInfo: {
          ...mockCategoryNavigationData.categoryInfo,
          hasDirectChildren: false,
        },

        directChildren: [],
      },

      PagedProducts: {
        data: {
          ...mockPagedProducts.data,
          products: [],
        },
      },

      categoryNavigationLoading: false,
      PagedProductsLoading: "succeeded",
    };

    renderCategories("/categories/electronics");

    expect(
      screen.getByText("No products match your filters."),
    ).toBeInTheDocument();

    expect(screen.getByTestId("lottie-handler")).toBeInTheDocument();
  });
});
