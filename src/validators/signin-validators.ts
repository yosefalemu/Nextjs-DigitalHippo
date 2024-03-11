import { z } from "zod"

export const SignInCredentialValidator = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email("Insert valid email"),
    password: z.string().min(1, { message: "Password is required" }),
});

export type TSignInCredentialValidator = z.infer<typeof SignInCredentialValidator>;
