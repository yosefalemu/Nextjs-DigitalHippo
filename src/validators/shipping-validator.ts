import { z } from "zod";

export const ShippingValidator = z.object({
  country: z
    .string()
    .min(1, { message: "Country field is required" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Country must contain only letters and spaces",
    }),
  city: z
    .string()
    .min(1, { message: "City is required" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "City must contain only letters and spaces",
    }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d{10}$/g, { message: "Phone number must be 10 digits" }),
});

export type TShippingValidator = z.infer<typeof ShippingValidator>;
