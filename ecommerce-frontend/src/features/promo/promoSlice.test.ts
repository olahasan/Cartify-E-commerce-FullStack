import { describe, expect, it, vi, beforeEach } from "vitest";
import promoReducer, { clearPromo, validatePromoCodeThunk } from "./promoSlice";
import { validatePromoCodeAPI } from "./promoApi";

vi.mock("./promoApi", () => ({
  validatePromoCodeAPI: vi.fn(),
}));

const mockedValidatePromoCodeAPI = vi.mocked(validatePromoCodeAPI);

const validPromoResponse = {
  isValid: true,
  message: "Promo code applied successfully",
  discountAmount: 20,
};

const invalidPromoResponse = {
  isValid: false,
  message: "Invalid promo code",
  discountAmount: 0,
};

describe("Promo Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the initial state", () => {
    const state = promoReducer(undefined, { type: "unknown" });

    expect(state.loading).toBe("idle");
    expect(state.error).toBeNull();
    expect(state.promoRes).toBeUndefined();
  });

  it("should clear promo data successfully", () => {
    const state = promoReducer(
      {
        loading: "succeeded",
        error: "Some error",
        promoRes: validPromoResponse,
      },
      clearPromo(),
    );

    expect(state.loading).toBe("idle");
    expect(state.error).toBeNull();
    expect(state.promoRes).toBeUndefined();
  });

  it("should set loading to pending when validating promo code", () => {
    const state = promoReducer(
      {
        loading: "idle",
        error: null,
        promoRes: undefined,
      },
      validatePromoCodeThunk.pending("request-id", {
        code: "SAVE20",
        orderTotal: 100,
      }),
    );

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store promo response when validation succeeds", () => {
    const state = promoReducer(
      {
        loading: "pending",
        error: null,
        promoRes: undefined,
      },
      validatePromoCodeThunk.fulfilled(validPromoResponse, "request-id", {
        code: "SAVE20",
        orderTotal: 100,
      }),
    );

    expect(state.loading).toBe("succeeded");
    expect(state.promoRes).toEqual(validPromoResponse);
  });

  it("should store promo error when validation fails", () => {
    const state = promoReducer(
      {
        loading: "pending",
        error: null,
        promoRes: undefined,
      },
      validatePromoCodeThunk.rejected(
        new Error("Invalid promo code"),
        "request-id",
        {
          code: "WRONG",
          orderTotal: 100,
        },
        invalidPromoResponse,
      ),
    );

    expect(state.loading).toBe("failed");
    expect(state.promoRes).toEqual(invalidPromoResponse);
    expect(state.error).toBe("Invalid promo code");
  });

  it("should validate promo code successfully when API succeeds", async () => {
    mockedValidatePromoCodeAPI.mockResolvedValue(validPromoResponse);

    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await validatePromoCodeThunk({
      code: "SAVE20",
      orderTotal: 100,
    })(dispatch, getState, undefined);

    expect(result.type).toBe("promo/validatePromoCodeThunk/fulfilled");
    expect(result.payload).toEqual(validPromoResponse);
    expect(mockedValidatePromoCodeAPI).toHaveBeenCalledWith({
      code: "SAVE20",
      orderTotal: 100,
    });
  });

  it("should reject when promo validation API fails", async () => {
    mockedValidatePromoCodeAPI.mockRejectedValue(
      new Error("Failed to validate promo code"),
    );

    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await validatePromoCodeThunk({
      code: "WRONG",
      orderTotal: 100,
    })(dispatch, getState, undefined);

    expect(result.type).toBe("promo/validatePromoCodeThunk/rejected");

    expect(result.payload).toEqual({
      isValid: false,
      message: "Failed to validate promo code",
      discountAmount: 0,
    });

    expect(result.meta.requestStatus).toBe("rejected");
  });
});
