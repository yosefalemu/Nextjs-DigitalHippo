import { stripe } from "../lib/stripe";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { CollectionConfig } from "payload/types";
import Stripe from "stripe";

const changeTheDiscountName: BeforeChangeHook = ({ data }) => {
  const dataTrimed = data.discountId.replace(/\s/g, "");
  console.log("Data trimed", dataTrimed);
  if (!/^[a-zA-Z0-9]+$/.test(dataTrimed)) {
    throw new Error("Discount Name can only contain letters and numbers.");
  }
  console.log("DONE FIRST STEP");
  return { ...data, discountId: dataTrimed };
};
const createStripeCoupons: BeforeChangeHook = async ({ data }) => {
  const couponParams: Stripe.CouponCreateParams = {
    id: data.discountId,
    percent_off: data.percentageDiscount,
    duration: "once",
    name: data.discountName,
  };
  console.log("SECOND STEP START");
  const createdCoupons = await stripe.coupons.create(couponParams);
  console.log("CREATED COUPONS", createdCoupons);
  const couponsAvailabels = await stripe.coupons.list({ limit: 10 });
  console.log("COUPONS AVAILABLES", couponsAvailabels);
};
export const Rate: CollectionConfig = {
  slug: "rate",
  admin: {
    useAsTitle: "Rate shipping",
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    beforeChange: [changeTheDiscountName, createStripeCoupons],
  },
  access: {
    read: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
    update: ({ req }) => req.user.role === "admin",
    delete: () => false,
  },
  fields: [
    {
      name: "discountId",
      label: "Discount Id",
      type: "text",
      required: true,
    },
    {
      name: "discountName",
      label: "Discount Name",
      type: "text",
      required: true,
    },
    {
      name: "priceForDiscount",
      label: "Price For Discount",
      type: "number",
      required: true,
    },
    {
      name: "pricePerKilometer",
      label: "Price Per Kilometer",
      type: "number",
      required: true,
    },
    {
      name: "percentageDiscount",
      label: "Percentage Discount",
      type: "number",
      required: true,
    },
  ],
};
