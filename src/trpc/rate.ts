import { getPayloadClient } from "../get-payload";
import { publicProcedure, router } from "./trpc";

export const rateRouter = router({
  getRate: publicProcedure.query(async () => {
    const payload = await getPayloadClient();
    const { docs: rateAvailables } = await payload.find({
      collection: "rate",
    });
    return { rateAvailables };
  }),
});
