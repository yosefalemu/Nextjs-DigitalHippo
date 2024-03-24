import { nullable, z } from "zod";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { xml2js } from "xml-js";

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
  getCity: publicProcedure.query(async () => {
    console.log("CALLED");
    const response = await fetch(
      "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
    );
    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch city",
      });
    }
    const cities = await response.json();
    return cities;
  }),
  getCityLatitudeAndLongtiude: publicProcedure
    .input(z.object({ geonameId: z.number().nullable() }))
    .query(async ({ input }) => {
      const { geonameId } = input;
      if (!geonameId) {
        console.log("NOTHING");
        console.log("NOTHING");
        return;
      }
      console.log("CALLED CONVERT");
      console.log("GEONAME", geonameId);
      const username = "yosef21232123";
      const response = await fetch(
        `http://api.geonames.org/get?geonameId=${geonameId}&username=${username}`
      );
      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change geonameId",
        });
      }
      console.log("RESPONSE", response);
      const xmlText = await response.text();
      const jsonData = xml2js(xmlText, { compact: true });
      const newData = jsonData;
      console.log("NEWDATA", newData);
      console.log("NEWDATAFORCHANGE", newData);
      return newData;
    }),
});
