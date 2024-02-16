import { ProductProps } from "@/utils/data/products";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as cartInMemory from "./helpers/cart-in-memory";

export type ProductCartProps = ProductProps & {
    quantity: number;
}

type StateProps = {
  products: ProductCartProps[];
  add: (product: ProductProps, quantityAdd: number) => void;
  remove: (productId: string, quantityRemove: number) => void;
  clear: () => void;
};

export const useCartStore = create(
  persist<StateProps>(
    (set) => ({
      products: [],
      add: (product: ProductProps, quantityAdd: number) => {
        set((state) => ({
          products: cartInMemory.add(state.products, product, quantityAdd),
        }));
      },
      remove: (productId: string, quantityRemove: number) =>
        set((state) => ({
          products: cartInMemory.remove(
            state.products,
            productId,
            quantityRemove
          ),
        })),
      clear: () => set(() => ({ products: [] })),
    }),
    {
      name: "nlw-expert:cart",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);