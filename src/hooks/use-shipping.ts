import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Shipping } from "@/payload-types";

type ShippingState = {
  shippingAddress: Shipping | null;
  addShippingState: (shippingData: Shipping) => void;
  getShippingState: () => void;
};
export const useShipping = create<ShippingState>()(
  persist(
    (set) => ({
      shippingAddress: null,
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
