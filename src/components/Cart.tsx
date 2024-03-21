"use client";
import { Option, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";
import { Separator } from "./ui/separator";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

const Cart = () => {
  const { items } = useCart();
  const itemCount = items?.length;
  console.log("items in the cart", items);

  const totalPrice = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  const fee = 1;

  console.log("CARTITEMS", items);

  return (
    <Sheet>
      <SheetTrigger className="group flex items-center -ml-2 p-2 relative">
        <ShoppingCart className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
        {itemCount > 0 && (
          <span className="h-5 w-5 flex items-center justify-center bg-blue-600 absolute top-0 -right-[15%] text-xs font-medium text-white rounded-full">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-[400px] flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>
            {itemCount > 0
              ? `Your cart have ${itemCount} products`
              : "Your Cart Is Empty"}
          </SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6 h-2/3">
              <ScrollArea className="max-h-full p-5">
                {items.map(({ product }) => (
                  <CartItem key={product?.id} product={product} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator className="h-1 bg-gray-50" />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>
                    {formatPrice(fee, { currency: "USD", notation: "compact" })}
                  </span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>
                    {formatPrice(totalPrice + fee, {
                      currency: "USD",
                      notation: "compact",
                    })}
                  </span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continue to Cart
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="empty shopping cart hippo"
              />
            </div>
            <div className="text-xl font-semibold border-b border-red-500">
              Your cart is empty
            </div>
            <div>
              <SheetTrigger asChild>
                <Link
                  href="/products"
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "text-sm text-muted-foreground",
                  })}
                >
                  Add items to your cart
                </Link>
              </SheetTrigger>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
