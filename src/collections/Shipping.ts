import { User } from "@/payload-types";
import { Access, CollectionConfig } from "payload/types";

const isAdminOrHasAccessToShipping: Access = async ({ req }) => {
  const user = req.user as User | null;
  if (user?.role === "admin") return true;
  if (!user) return false;
  return {
    user: {
      equals: req.user.id,
    },
  };
};

const isYourOwnFile: Access = async ({ req }) => {
  const user = req.user as User | null;
  return {
    user: {
      equals: req.user.id,
    },
  };
};

export const Shipping: CollectionConfig = {
  slug: "shipping",
  admin: {
    useAsTitle: "Shipping Address",
  },
  access: {
    read: isAdminOrHasAccessToShipping,
    create: () => true,
    update: isYourOwnFile,
    delete: () => false,
  },
  fields: [
    {
      name: "country",
      label: "Country",
      type: "text",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
    },
    {
      name: "city",
      label: "City",
      type: "text",
    },
    { name: "state", label: "State", type: "text" },
    { name: "latitude", label: "Latitude", type: "text" },
    { name: "longitude", label: "Longitude", type: "text" },
    {
      name: "user",
      label: "User",
      type: "relationship",
      relationTo: "users",
    },
  ],
};
