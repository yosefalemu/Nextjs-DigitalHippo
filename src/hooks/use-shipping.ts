import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Shipping } from "@/payload-types";

type ShippingState = {
  shippingAddress: Shipping | {};
  addShippingState: (shippingData: Shipping) => void;
  getShippingState: () => void;
};
export const useShipping = create<ShippingState>()(
  persist(
    (set) => ({
      shippingAddress: {},
      addShippingState: (shippingData: Shipping) => {
        set({ shippingAddress: shippingData });
      },
      getShippingState: () => {},
    }),
    {
      name: "shipping-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
