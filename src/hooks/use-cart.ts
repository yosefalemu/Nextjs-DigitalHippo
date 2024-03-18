import { Product } from '@/payload-types'
import { toast } from 'sonner'
import { create } from 'zustand'
import {
    createJSONStorage,
    persist,
} from 'zustand/middleware'

export type CartItem = {
    product: Product
}

type CartState = {
    items: CartItem[],
    addItem: (product: Product) => boolean,
    removeItem: (id: string) => void
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const isProductOnCart = get().items.some((state) => state.product.id === product.id)
                if (!isProductOnCart) {
                    set((state) => {
                        return { items: [...state.items, { product }] }
                    })
                    toast.success("Product is added to cart")
                    return true
                }
                toast.error("Product is already on cart")
                return false
            },
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== id)
                }))
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
