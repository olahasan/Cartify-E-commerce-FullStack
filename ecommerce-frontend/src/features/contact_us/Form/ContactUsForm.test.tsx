// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ContactUsForm from "./ContactUsForm";

const { mockToastSuccess } = vi.hoisted(() => ({
  mockToastSuccess: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: mockToastSuccess,
  },
}));

describe("ContactUsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render all form fields and the submit button", () => {
    render(<ContactUsForm />);

    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your Email Address"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Phone")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("How can we help you?"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Send Message" }),
    ).toBeInTheDocument();
  });

  it("should show validation errors when submitting an empty form", async () => {
    render(<ContactUsForm />);

    const submitButton = screen.getByRole("button", {
      name: "Send Message",
    });

    fireEvent.click(submitButton);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();

    expect(screen.getByText("email Address is required")).toBeInTheDocument();
  });

  it("should show an error when the email is invalid", async () => {
    render(<ContactUsForm />);

    const emailInput = screen.getByPlaceholderText("Your Email Address");

    fireEvent.change(emailInput, {
      target: { value: "invalid-email" },
    });

    fireEvent.blur(emailInput);

    expect(
      await screen.findByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("should show an error when the phone number is invalid", async () => {
    render(<ContactUsForm />);

    const phoneInput = screen.getByPlaceholderText("Your Phone");

    fireEvent.change(phoneInput, {
      target: { value: "123" },
    });

    fireEvent.blur(phoneInput);

    expect(
      await screen.findByText("Phone number must be at least 8 digits"),
    ).toBeInTheDocument();
  });

  it("should show an error when the message is too short", async () => {
    render(<ContactUsForm />);

    const messageInput = screen.getByPlaceholderText("How can we help you?");

    fireEvent.change(messageInput, {
      target: { value: "Too short" },
    });

    fireEvent.blur(messageInput);

    expect(
      await screen.findByText("Message must be at least 10 characters"),
    ).toBeInTheDocument();
  });

  it("should show the loading state while submitting", async () => {
    render(<ContactUsForm />);

    const nameInput = screen.getByPlaceholderText("Your Name");
    const emailInput = screen.getByPlaceholderText("Your Email Address");
    const phoneInput = screen.getByPlaceholderText("Your Phone");
    const messageInput = screen.getByPlaceholderText("How can we help you?");

    fireEvent.input(nameInput, {
      target: { value: "Ola Ali" },
    });

    fireEvent.input(emailInput, {
      target: { value: "ola@example.com" },
    });

    fireEvent.input(phoneInput, {
      target: { value: "+201234567890" },
    });

    fireEvent.input(messageInput, {
      target: { value: "I need help with my order." },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Message",
      }),
    );

    const sendingButton = await screen.findByRole("button", {
      name: /Sending Message/i,
    });

    expect(sendingButton).toBeDisabled();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should show a success toast after submitting valid data", async () => {
    render(<ContactUsForm />);

    fireEvent.input(screen.getByPlaceholderText("Your Name"), {
      target: { value: "Ola Ali" },
    });

    fireEvent.input(screen.getByPlaceholderText("Your Email Address"), {
      target: { value: "ola@example.com" },
    });

    fireEvent.input(screen.getByPlaceholderText("Your Phone"), {
      target: { value: "+201234567890" },
    });

    fireEvent.input(screen.getByPlaceholderText("How can we help you?"), {
      target: { value: "I need help with my order." },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Message",
      }),
    );

    await waitFor(
      () => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "✔ Message sent successfully. We'll get back to you as soon as possible.",
        );
      },
      { timeout: 2000 },
    );
  });

  it("should reset the form after successful submission", async () => {
    render(<ContactUsForm />);

    const nameInput = screen.getByPlaceholderText(
      "Your Name",
    ) as HTMLInputElement;

    const emailInput = screen.getByPlaceholderText(
      "Your Email Address",
    ) as HTMLInputElement;

    const phoneInput = screen.getByPlaceholderText(
      "Your Phone",
    ) as HTMLInputElement;

    const messageInput = screen.getByPlaceholderText(
      "How can we help you?",
    ) as HTMLTextAreaElement;

    fireEvent.input(nameInput, {
      target: { value: "Ola Ali" },
    });

    fireEvent.input(emailInput, {
      target: { value: "ola@example.com" },
    });

    fireEvent.input(phoneInput, {
      target: { value: "+201234567890" },
    });

    fireEvent.input(messageInput, {
      target: { value: "I need help with my order." },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Message",
      }),
    );

    await waitFor(
      () => {
        expect(nameInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
        expect(phoneInput).toHaveValue("");
        expect(messageInput).toHaveValue("");
      },
      { timeout: 2000 },
    );
  });
});
