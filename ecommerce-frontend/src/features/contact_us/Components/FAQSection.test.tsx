// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FAQSection from "./FAQSection";
import { act } from "react";

describe("FAQSection", () => {
  it("should render the FAQ section title", () => {
    render(<FAQSection />);

    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });

  it("should render the FAQ heading", () => {
    render(<FAQSection />);

    expect(screen.getByRole("heading", { name: "FAQ" })).toBeInTheDocument();
  });

  it("should render all FAQ questions", () => {
    render(<FAQSection />);

    expect(
      screen.getByRole("button", {
        name: "How can I track my order?",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "What payment methods do you accept?",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Can I return or exchange a product?",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "How long does shipping take?",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "How can I contact customer support?",
      }),
    ).toBeInTheDocument();
  });

  it("should render the illustration image", () => {
    render(<FAQSection />);

    expect(screen.getByAltText("illustration-woman")).toBeInTheDocument();
  });

  it("should keep all FAQ answers hidden initially", () => {
    render(<FAQSection />);

    const questions = screen.getAllByRole("button");

    questions.forEach((question) => {
      expect(question).toHaveAttribute("aria-expanded", "false");
    });

    const firstAnswer = document.getElementById("faq-0");

    expect(firstAnswer).toBeInTheDocument();
    expect(firstAnswer?.className).toMatch(/hide/);
  });

  it("should associate each question with its answer using aria-controls", () => {
    render(<FAQSection />);

    const questions = screen.getAllByRole("button");

    questions.forEach((question, index) => {
      expect(question).toHaveAttribute("aria-controls", `faq-${index}`);
    });
  });

  it("should have a matching answer element for every question", () => {
    render(<FAQSection />);

    const questions = screen.getAllByRole("button");

    questions.forEach((question, index) => {
      const answerId = question.getAttribute("aria-controls");

      expect(answerId).toBe(`faq-${index}`);
      expect(document.getElementById(answerId!)).toBeInTheDocument();
    });
  });

  it("should open an FAQ when the user clicks its question", async () => {
    const user = userEvent.setup();

    render(<FAQSection />);

    const question = screen.getByRole("button", {
      name: "How can I track my order?",
    });

    await user.click(question);

    expect(question).toHaveAttribute("aria-expanded", "true");

    expect(
      screen.getByText(
        "After your order is shipped, you'll receive an email with a tracking number so you can follow its delivery status.",
      ),
    ).not.toHaveClass("hide");
  });

  it("should close an opened FAQ when clicking the same question again", async () => {
    const user = userEvent.setup();

    render(<FAQSection />);

    const question = screen.getByRole("button", {
      name: "How can I track my order?",
    });

    await user.click(question);

    expect(question).toHaveAttribute("aria-expanded", "true");

    await user.click(question);

    expect(question).toHaveAttribute("aria-expanded", "false");

    const answer = document.getElementById("faq-0");

    expect(answer).toBeInTheDocument();
    expect(answer?.className).toMatch(/hide/);
  });

  it("should close the previously opened FAQ when another question is clicked", async () => {
    const user = userEvent.setup();

    render(<FAQSection />);

    const firstQuestion = screen.getByRole("button", {
      name: "How can I track my order?",
    });

    const secondQuestion = screen.getByRole("button", {
      name: "What payment methods do you accept?",
    });

    await user.click(firstQuestion);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");

    await user.click(secondQuestion);

    expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  });

  it("should show the correct answer for the selected question", async () => {
    const user = userEvent.setup();

    render(<FAQSection />);

    const question = screen.getByRole("button", {
      name: "What payment methods do you accept?",
    });

    await user.click(question);

    expect(
      screen.getByText(
        "We accept Visa, Mastercard, and other secure payment methods through our encrypted checkout process.",
      ),
    ).toBeVisible();
  });

  it("should update aria-expanded only for the selected question", async () => {
    const user = userEvent.setup();

    render(<FAQSection />);

    const questions = screen.getAllByRole("button");

    await user.click(questions[2]);

    expect(questions[2]).toHaveAttribute("aria-expanded", "true");

    questions.forEach((question, index) => {
      if (index !== 2) {
        expect(question).toHaveAttribute("aria-expanded", "false");
      }
    });
  });

  it("should show BackToTop after scrolling down", () => {
    render(<FAQSection />);

    expect(screen.queryByTestId("back-to-top")).not.toBeInTheDocument();

    act(() => {
      window.scrollY = 301;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
  });
});
