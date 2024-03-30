import { getPayloadClient } from "../get-payload";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { RateValidators } from "@/validators/rateValidators";

export const rateRouter = router({
  getRate: publicProcedure.query(async () => {
    const payload = await getPayloadClient();
    const { docs: rateAvailables } = await payload.find({
      collection: "rate",
    });
    return { rateAvailables };
  }),
});
