"use client";
import { Product } from "@/payload-types";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface AddToCartProps {
  product: Product;
}
const AddToCart = ({ product }: AddToCartProps) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const handleAddProduct = () => {
    console.log("Test the product");
    setIsSuccess(true);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
    return () => clearTimeout(timeOut);
  }, [isSuccess]);

  return (
    <Button
      onClick={handleAddProduct}
      size={"lg"}
      className="w-full"
      disabled={isSuccess}
    >
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCart;
