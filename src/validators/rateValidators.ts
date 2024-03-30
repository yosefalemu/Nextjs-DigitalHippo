import { z } from "zod";

export const RateValidators = z.object({
  discountName: z.string().superRefine((val, ctx) => {
    if (val === undefined || val.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Discount name is required",
      });
    } else if (!/^[a-zA-Z0-9]+$/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Discount name must contain only letters and numbers (no spaces)",
      });
    }
  }),
  percentOff: z.number().superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Percent off is required",
      });
    }
  }),
  priceForDiscount: z.number().superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Price for discount is required",
      });
    }
  }),
  pricePerKilometer: z.number().superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Price per kilometer is required",
      });
    }
  }),
});

export type TRateValidators = z.infer<typeof RateValidators>;
