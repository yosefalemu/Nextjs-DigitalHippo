"use client";
import { Product } from "@/payload-types";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";

import { useEffect, useState } from "react";
import { BaggageClaim } from "lucide-react";
import Link from "next/link";

interface AddToCartProps {
  product: Product;
}
const AddToCart = ({ product }: AddToCartProps) => {
  const { addItem, items } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [productInCart, setProductInCart] = useState<Product | null>(null);
  console.log("items", items);

  useEffect(() => {
    const productFound = items.find((item) => item.product.id === product.id);
    setProductInCart(productFound?.product || null);
    const timeOut = setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
    return () => clearTimeout(timeOut);
  }, [isSuccess]);

  const handleAddProduct = () => {
    const timeOut = setTimeout(() => {
      addItem(product);
    }, 3000);
    setIsSuccess(true);
    return () => clearTimeout(timeOut);
  };
  console.log("Product in cart", productInCart);

  return (
    <>
      {productInCart ? (
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex items-center gap-2 text-green-500">
            <BaggageClaim />
            <h1>Product is on cart</h1>
          </div>
          <Link href={"/cart"} className="w-full">
            <Button className="w-full" variant={"link"}>
              Go to cart
            </Button>
          </Link>
        </div>
      ) : (
        <Button
          onClick={handleAddProduct}
          size={"lg"}
          className="w-full"
          disabled={isSuccess}
        >
          {isSuccess ? "Added!" : "Add to cart"}
        </Button>
      )}
    </>
  );
};

export default AddToCart;
