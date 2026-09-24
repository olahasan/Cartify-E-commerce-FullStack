import { z } from "zod";

const ChangePasswordSchema = z
  .object({
    currentpassword: z
      .string()
      .min(8, { message: "password must be at least 8 charachters" })
      .max(100, { message: "Email cannot exceed 100 characters" })
      .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {
        message: "Password should contain at least 1 special character",
      }),
    newpassword: z
      .string()
      .min(8, { message: "password must be at least 8 charachters" })
      .max(100, { message: "Email cannot exceed 100 characters" })
      .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {
        message: "Password should contain at least 1 special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "confirm Password is Required" }),
  })
  .refine((input) => input.newpassword === input.confirmPassword, {
    message: "New password and confirmPassword does not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormDataType = z.infer<typeof ChangePasswordSchema>;

export { ChangePasswordSchema, type ChangePasswordFormDataType };
