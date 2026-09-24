import { z } from "zod";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email Address is Required" })
    .email()
    .max(100, { message: "Email cannot exceed 100 characters" }),
});

type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

export { ForgotPasswordSchema, type ForgotPasswordType };
