import { z } from "zod";

const AddressSchema = z.object({
  addressType: z.string(),
  streetAddress: z
    .string()
    .min(1, { message: "street Address is Required" })
    .max(70, { message: "street Address cannot exceed 70 characters" }),
  city: z
    .string()
    .min(1, { message: "city is Required" })
    .max(50, { message: "city cannot exceed 50 characters" }),
  state: z.string().max(50, { message: "اسم الولاية طويل جداً" }).nullable(),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, {
      message: "postalCode must be exactly 5 digits",
    })
    .nullable(),
  country: z.string(),
  isDefault: z.boolean(),
});

type AddressFormDataType = z.infer<typeof AddressSchema>;

export { AddressSchema, type AddressFormDataType };
