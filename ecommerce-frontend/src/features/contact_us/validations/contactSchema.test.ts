import { describe, expect, it } from "vitest";

import { contactSchema } from "./contactSchema";

describe("contactSchema", () => {
  it("should accept valid contact data", () => {
    const validData = {
      name: "Ola Ali",
      email: "ola@example.com",
      phone: "+201001234567",
      message: "I need help with my order.",
    };

    const result = contactSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should reject an empty name", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "ola@example.com",
      phone: "+201001234567",
      message: "I need help with my order.",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a name longer than 100 characters", () => {
    const result = contactSchema.safeParse({
      name: "a".repeat(101),
      email: "ola@example.com",
      phone: "+201001234567",
      message: "I need help with my order.",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an empty email", () => {
    const result = contactSchema.safeParse({
      name: "Ola Ali",
      email: "",
      phone: "+201001234567",
      message: "I need help with my order.",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Ola Ali",
      email: "invalid-email",
      phone: "+201001234567",
      message: "I need help with my order.",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a phone number shorter than 8 characters", () => {
    const result = contactSchema.safeParse({
      name: "Ola Ali",
      email: "ola@example.com",
      phone: "1234567",
      message: "I need help with my order.",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({
      name: "Ola Ali",
      email: "ola@example.com",
      phone: "+201001234567",
      message: "Too short",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a message longer than 1000 characters", () => {
    const result = contactSchema.safeParse({
      name: "Ola Ali",
      email: "ola@example.com",
      phone: "+201001234567",
      message: "a".repeat(1001),
    });

    expect(result.success).toBe(false);
  });
});
