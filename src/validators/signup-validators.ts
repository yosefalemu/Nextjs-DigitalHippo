import { z } from "zod"

export const SignUpCredentialValidator = z.object({
    firstName: z
        .string({
            required_error: "First name is required",
            invalid_type_error: "First name must be string",
        })
        .min(3, { message: "First name should be atleast 3 characters long" })
        .regex(/^[a-zA-Z]+$/, { message: "First name must contain letter only" }),
    lastName: z
        .string({
            required_error: "Last name is required",
            invalid_type_error: "Last name must be string",
        })
        .min(3, { message: "Last name should be atleast 3 characters long" })
        .regex(/^[a-zA-Z]+$/, { message: "Last name must contain letter only" }),
    userName: z
        .string({
            required_error: "Username is required",
        })
        .min(6, { message: "User name should be atleast 6 characters long" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email("Invalid email"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be atleast 8 characters long" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long",
            }
        ),
});

export type TSignUpCredentialValidator = z.infer<typeof SignUpCredentialValidator>;