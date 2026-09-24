// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import Contact_Us from "./Contact_Us";

describe("Contact_Us", () => {
  it("should scroll to the top when the page loads", () => {
    const scrollToMock = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});

    render(<Contact_Us />);

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);

    scrollToMock.mockRestore();
  });
});
