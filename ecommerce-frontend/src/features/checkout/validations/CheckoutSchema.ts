import { z } from "zod";

const CheckoutSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is Required" })
    .max(50, { message: "First Name cannot exceed 50 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last Name is Required" })
    .max(50, { message: "Last Name cannot exceed 50 characters" }),
  email: z
    .string()
    .min(1, { message: "email Address is Required" })
    .email()
    .max(100, { message: "Email cannot exceed 100 characters" }),
  phone: z
    .string()
    .regex(/^\d{6,15}$/, "Invalid phone number")
    .min(1, { message: "phone number is Required" })
    .min(6, { message: "phone number is short" })
    .max(15, { message: "phone cannot exceed 20 digits" }),

  countryCode: z
    .string()
    .regex(/^\+\d{1,4}$/, "Invalid country code")
    .min(1, { message: "country Code is Required" }),

  defaultAddress: z.object({
    // addressType: z.string(),
    addressType: z.string().min(1, "Address type is required"),
    streetAddress: z
      .string()
      .min(1, { message: "street Address is Required" })
      .max(70, { message: "street Address cannot exceed 70 characters" }),
    city: z
      .string()
      .min(1, { message: "city is Required" })
      .max(50, { message: "city cannot exceed 50 characters" }),
    state: z
      .string()
      .max(50, { message: "State/Province cannot exceed 50 characters" })
      .nullable(),
    postalCode: z
      .string()
      .regex(/^\d{5}$/, {
        message: "postalCode must be exactly 5 digits",
      })
      .nullable(),
    country: z.string(),
    isDefault: z.boolean(),
  }),
  defaultPaymentMethod: z
    .object({
      cardHolderName: z.string().optional(),
    })
    .optional(),
});

type CheckoutSchemaType = z.infer<typeof CheckoutSchema>;

export { CheckoutSchema, type CheckoutSchemaType };
