import { z } from "zod";

export const ShippingValidator = z.object({
  country: z.string().min(1, { message: "Country field is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d{10}$/g, { message: "Phone number must be 10 digits" }),
  state: z.string().min(1, { message: "State is required" }),
  latitude: z.string().min(1, { message: "Latitude is required" }),
  longitude: z.string().min(1, { message: "Longitude is required" }),
});

export type TShippingValidator = z.infer<typeof ShippingValidator>;
