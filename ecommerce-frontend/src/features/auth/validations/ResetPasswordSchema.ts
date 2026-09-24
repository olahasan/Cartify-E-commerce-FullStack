import { z } from "zod";

const ResetPasswordSchema = z
  .object({
    newpassword: z
      .string()
      .min(8, { message: "password must be at least 8 charachters" })
      .max(100, { message: "Password cannot exceed 100 characters" })
      .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {
        message: "Password should contain at least 1 special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "confirm Password is Required" }),
  })
  .refine((input) => input.newpassword === input.confirmPassword, {
    message: "newpassword and confirmPassword does not match",
    path: ["confirmPassword"],
  });

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export { ResetPasswordSchema, type ResetPasswordType };
