import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "email Address is required" })
    .email("Please enter a valid email address")
    .max(100, { message: "Email cannot exceed 100 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]+$/, {
      message: "Please enter a valid phone number",
    })
    .min(8, { message: "Phone number must be at least 8 digits" })
    .max(20, { message: "Phone number is too long" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
});

type contactType = z.infer<typeof contactSchema>;

export { contactSchema, type contactType };
