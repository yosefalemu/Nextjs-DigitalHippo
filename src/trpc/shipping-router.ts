import { privateProcedure, publicProcedure, router } from "./trpc";
import { ShippingValidator } from "../validators/shipping-validator";
import { getPayloadClient } from "../get-payload";

export const ShippingRouter = router({
  CreateShipping: privateProcedure
    .input(ShippingValidator)
    .mutation(async ({ input, ctx }) => {
      console.log("the input", input);
      const { user } = ctx;
      const { city, country, phoneNumber } = input;
      const payload = await getPayloadClient();
      const createdShipping = await payload.create({
        collection: "shipping",
        data: {
          city,
          country,
          phoneNumber,
          user: user.id,
        },
      });
      console.log("CREATED SHIPPING", createdShipping);
      return { success: true, createdShipping: createdShipping };
    }),
});
