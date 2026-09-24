import { z } from "zod";

const signInSchema = z.object({
  email: z.string().min(1, { message: "email Address is Required" }).email(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 charachters" })
    .max(100, { message: "Email cannot exceed 100 characters" }),
});

type signInType = z.infer<typeof signInSchema>;

export { signInSchema, type signInType };
