import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const countryRouter = router({
  getCountry: publicProcedure.query(async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch countries",
      });
    }
    const countries = await response.json();

    return countries;
  }),
});
