// // @vitest-environment jsdom
// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "./Home";

const mockDispatch = vi.fn();

type MockHomePageSection = {
  sectionName: string;
  sectionSlug: string;
  hierarchy: string;
};

let mockProductState: {
  homePageSections: MockHomePageSection[];
  homePageSectionsLoading: boolean;
  homePageSectionsError: string | null;
} = {
  homePageSections: [],
  homePageSectionsLoading: false,
  homePageSectionsError: null,
};

vi.mock("@app/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      product: mockProductState,
    }),
}));

vi.mock("@products/productSlice", () => ({
  getHomePageSections: vi.fn(() => ({
    type: "product/getHomePageSections",
  })),
}));

vi.mock("../components/HeroCarousel", () => ({
  default: ({ pics }: { pics: string[] }) => (
    <div data-testid="hero-carousel">Hero Carousel ({pics.length})</div>
  ),
}));

vi.mock("../components/AdvertisementBanner", () => ({
  default: ({ pic }: { pic: string }) => (
    <div data-testid="advertisement-banner">{pic}</div>
  ),
}));

vi.mock("@swiper/carousels/HomeCategoriesCarousel", () => ({
  default: () => (
    <div data-testid="home-categories-carousel">Home Categories Carousel</div>
  ),
}));

vi.mock("../components/HomeMainSection", () => ({
  default: () => <div data-testid="home-main-section">Home Main Section</div>,
}));

vi.mock("@products/components/TopRatedCarousel", () => ({
  default: () => <div data-testid="top-rated-carousel">Top Rated Carousel</div>,
}));

vi.mock("../components/CategorySection", () => ({
  default: ({
    sectionName,
    sectionSlug,
  }: {
    sectionName: string;
    sectionSlug: string;
  }) => (
    <div data-testid="category-section">
      {sectionName} - {sectionSlug}
    </div>
  ),
}));

vi.mock("@home/Skeleton/HomeSkeleton", () => ({
  default: () => <div data-testid="home-skeleton">Loading...</div>,
}));

vi.mock("@shared/LottieHandler/LottieHandler", () => ({
  default: ({ type, message }: { type: string; message: string }) => (
    <div data-testid="lottie-handler">
      {type} - {message}
    </div>
  ),
}));

vi.mock("@shared/BackToTop/BackToTop", () => ({
  default: () => <div data-testid="back-to-top">Back To Top</div>,
}));

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockProductState = {
      homePageSections: [],
      homePageSectionsLoading: false,
      homePageSectionsError: null,
    };
  });

  it("should dispatch getHomePageSections when the page loads", () => {
    render(<Home />);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "product/getHomePageSections",
    });
  });

  it("should render HomeSkeleton while loading", () => {
    mockProductState.homePageSectionsLoading = true;

    render(<Home />);

    expect(screen.getByTestId("home-skeleton")).toBeInTheDocument();
  });

  it("should render the error state when loading fails", () => {
    mockProductState.homePageSectionsError = "Something went wrong";

    render(<Home />);

    expect(screen.getByTestId("lottie-handler")).toHaveTextContent(
      "error - Error loading home sections: Something went wrong",
    );
  });

  it("should render the main home sections when loading succeeds", () => {
    mockProductState.homePageSections = [
      {
        sectionName: "Electronics",
        sectionSlug: "electronics",
        hierarchy: "Electronics",
      },
    ];

    render(<Home />);

    expect(screen.getByTestId("hero-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("home-categories-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("home-main-section")).toBeInTheDocument();
    expect(screen.getByTestId("top-rated-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("category-section")).toHaveTextContent(
      "Electronics - electronics",
    );
  });

  it("should render the Beauty advertisement", () => {
    mockProductState.homePageSections = [
      {
        sectionName: "Beauty",
        sectionSlug: "beauty",
        hierarchy: "Beauty",
      },
    ];

    render(<Home />);
    expect(screen.getAllByTestId("advertisement-banner")).toHaveLength(2);
  });

  it("should render the Furniture advertisement", () => {
    mockProductState.homePageSections = [
      {
        sectionName: "Furniture",
        sectionSlug: "furniture",
        hierarchy: "Furniture",
      },
    ];

    render(<Home />);

    expect(screen.getAllByTestId("advertisement-banner")).toHaveLength(2);
  });

  it("should render the Furniture carousel for Sports", () => {
    mockProductState.homePageSections = [
      {
        sectionName: "Sports",
        sectionSlug: "sports",
        hierarchy: "Sports",
      },
    ];

    render(<Home />);

    expect(screen.getAllByTestId("hero-carousel")).toHaveLength(2);
  });

  it("should render the BackToTop component", () => {
    render(<Home />);

    expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
  });
});
