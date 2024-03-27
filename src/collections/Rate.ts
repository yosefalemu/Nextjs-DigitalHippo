import { Access, CollectionConfig } from "payload/types";

export const Rate: CollectionConfig = {
  slug: "rate",
  admin: {
    useAsTitle: "Rate shipping",
    hidden: ({ user }) => user.role !== "admin",
  },
  access: {
    read: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
    update: ({ req }) => req.user.role === "admin",
    delete: () => false,
  },
  fields: [
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
      name: "discountAmount",
      label: "Discount Amount",
      type: "number",
      required: true,
    },
  ],
};
