import { z } from "zod";

const PersonalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is Required" })
    .max(50, { message: "First Name cannot exceed 50 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last Name is Required" })
    .max(50, { message: "Last Name cannot exceed 50 characters" }),
  countryCode: z
    .string()
    .regex(/^\+\d{1,4}$/, "Invalid country code")
    .min(1, { message: "country Code is Required" }),
  phone: z
    .string()
    .regex(/^\d{6,15}$/, "Invalid phone number")
    .min(1, { message: "phone number is Required" })
    .min(10, { message: "phone number is short" })
    .max(15, { message: "phone cannot exceed 20 digits" }),

  dateOfBirth: z.string().optional(),
  profilePicture: z.string().optional().nullable(),
});

type PersonalInfoSchemaType = z.infer<typeof PersonalInfoSchema>;

export { PersonalInfoSchema, type PersonalInfoSchemaType };
