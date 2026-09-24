// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { TLoginReturn } from "@auth/authAPI";
import type { SuggestionsData } from "@search/searchAPI";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Header from "./Header";

import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Logout } from "@auth/authSlice";
import { GetCartSummary } from "@cart/cartSlice";
import { GetWishlistByUserID, GetwishlistCount } from "@wishlist/wishlistSlice";
import { GetSuggestionsThunk } from "@search/SearchSlice";
import { persistor } from "@app/store/store";

vi.mock("@app/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("@auth/authSlice", () => ({
  Logout: vi.fn(),
}));

vi.mock("@cart/cartSlice", () => ({
  GetCartSummary: vi.fn(),
}));

vi.mock("@wishlist/wishlistSlice", () => ({
  GetWishlistByUserID: vi.fn(),
  GetwishlistCount: vi.fn(),
}));

vi.mock("@search/SearchSlice", () => ({
  GetSuggestionsThunk: vi.fn(),
}));

vi.mock("@app/store/store", () => ({
  persistor: {
    purge: vi.fn(),
  },
}));

// Cart / Wishlist icons
vi.mock("@cart/index", () => ({
  CartLogo: () => <div data-testid="cart-logo">Cart</div>,
}));

vi.mock("@wishlist/index", () => ({
  WishlistLogo: ({ totalQuantity }: { totalQuantity: number }) => (
    <div data-testid="wishlist-logo">Wishlist: {totalQuantity}</div>
  ),
}));

const mockedDispatch = vi.fn();

const createDefaultAuthState = () => ({
  LoginReturn: null as TLoginReturn | null,
});

const createDefaultWishlistState = () => ({
  wishlistCount: 0,
});

const createDefaultSearchState = () => ({
  Suggestions: [] as SuggestionsData,
});

let mockState: MockState;

type MockState = {
  auth: ReturnType<typeof createDefaultAuthState>;
  wishlist: ReturnType<typeof createDefaultWishlistState>;
  search: ReturnType<typeof createDefaultSearchState>;
};

const renderHeader = () => {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>,
  );
};

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockState = {
      auth: createDefaultAuthState(),
      wishlist: createDefaultWishlistState(),
      search: createDefaultSearchState(),
    };

    vi.mocked(useAppDispatch).mockReturnValue(mockedDispatch);

    vi.mocked(useAppSelector).mockImplementation((selector) =>
      selector({
        ...mockState,
      } as never),
    );

    vi.mocked(Logout).mockReturnValue({
      type: "auth/Logout",
    } as never);

    vi.mocked(GetCartSummary).mockReturnValue({
      type: "cart/GetCartSummary",
    } as never);

    vi.mocked(GetwishlistCount).mockReturnValue({
      type: "wishlist/GetwishlistCount",
    } as never);

    vi.mocked(GetWishlistByUserID).mockReturnValue({
      type: "wishlist/GetWishlistByUserID",
    } as never);

    vi.mocked(GetSuggestionsThunk).mockReturnValue({
      type: "search/GetSuggestionsThunk",
    } as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render Login and Register when user is not authenticated", () => {
    renderHeader();

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();

    expect(screen.queryByText(/Welcome:/)).not.toBeInTheDocument();
  });

  it("should render the user menu when user is authenticated", () => {
    mockState.auth.LoginReturn = {
      token: "test-token",
      firstName: "Ola",
      lastName: "Ali",
      success: true,
      message: "Login successful",
    };

    renderHeader();

    expect(screen.getByText("Welcome: Ola Ali")).toBeInTheDocument();

    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Register")).not.toBeInTheDocument();
  });

  it("should fetch cart and wishlist data when user is authenticated", async () => {
    mockState.auth.LoginReturn = {
      token: "test-token",
      firstName: "Ola",
      lastName: "Ali",
      success: true,
      message: "Login successful",
    };

    renderHeader();

    await waitFor(() => {
      expect(GetCartSummary).toHaveBeenCalled();
      expect(GetwishlistCount).toHaveBeenCalled();
      expect(GetWishlistByUserID).toHaveBeenCalled();
    });

    expect(mockedDispatch).toHaveBeenCalled();
  });

  it("should not fetch cart and wishlist data when user is not authenticated", () => {
    renderHeader();

    expect(GetCartSummary).not.toHaveBeenCalled();
    expect(GetwishlistCount).not.toHaveBeenCalled();
    expect(GetWishlistByUserID).not.toHaveBeenCalled();
  });

  it("should update search input when user types", () => {
    renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, {
      target: { value: "laptop" },
    });

    expect(searchInput).toHaveValue("laptop");
  });

  it("should dispatch search suggestions after debounce", () => {
    vi.useFakeTimers();

    renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, {
      target: { value: "laptop" },
    });

    expect(GetSuggestionsThunk).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(GetSuggestionsThunk).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(GetSuggestionsThunk).toHaveBeenCalledWith("laptop");
    expect(mockedDispatch).toHaveBeenCalled();
  });

  it("should not dispatch search suggestions when search input is empty", async () => {
    vi.useFakeTimers();

    renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, {
      target: { value: "   " },
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(GetSuggestionsThunk).not.toHaveBeenCalled();
  });

  it("should render search suggestions when available", () => {
    mockState.search.Suggestions = [
      {
        suggestionText: "Laptop",
      },
      {
        suggestionText: "Phone",
      },
    ];

    renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.focus(searchInput);

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  it("should navigate to search page when Enter is pressed", () => {
    renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, {
      target: { value: "laptop" },
    });

    fireEvent.keyDown(searchInput, {
      key: "Enter",
    });

    expect(screen.getByPlaceholderText("Search...")).toHaveValue("");
  });

  it("should not search when Enter is pressed with empty input", () => {
    renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.keyDown(searchInput, {
      key: "Enter",
    });

    expect(searchInput).toHaveValue("");
  });

  it("should navigate when a search suggestion is clicked", () => {
    mockState.search.Suggestions = [
      {
        suggestionText: "Laptop",
      },
    ];

    renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.focus(searchInput);

    const suggestion = screen.getByText("Laptop");

    fireEvent.click(suggestion);

    expect(searchInput).toHaveValue("Laptop");
  });

  it("should dispatch Logout and purge persisted state when logout is clicked", async () => {
    mockState.auth.LoginReturn = {
      token: "test-token",
      firstName: "Ola",
      lastName: "Ali",
      success: true,
      message: "Login successful",
    };

    renderHeader();

    const welcomeMenu = screen.getByText("Welcome: Ola Ali");

    fireEvent.click(welcomeMenu);

    const logoutButton = await screen.findByText("Logout");

    fireEvent.click(logoutButton);

    expect(Logout).toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalled();
    expect(persistor.purge).toHaveBeenCalled();
  });

  it("should pass wishlist count to WishlistLogo", () => {
    mockState.wishlist.wishlistCount = 5;

    renderHeader();

    expect(screen.getByTestId("wishlist-logo")).toHaveTextContent(
      "Wishlist: 5",
    );
  });
});
