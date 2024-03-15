import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import { Skeleton } from "./ui/skeleton";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  console.log("index of the product listing", index);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, index * 75);
  }, [index]);

  if (!isVisible || !product) {
    return <ProductListingPlaceHolder />;
  }

  const validImageUrl = product?.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <Link
      href={`/product/${product?.id}`}
      className={cn(
        "invisible h-full w-full cursor-pointer lg:rounded-tl-2xl lg:rounded-tr-2xl",
        {
          "visible animate-in fade-in-5": isVisible,
        }
      )}
    >
      <div className="flex flex-col w-full inset-0">
        <ImageSlider validImageUrl={validImageUrl} />
        <h3 className="mt-4 font-medium text-sm text-gray-700">
          {product?.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product?.category}</p>
        <p className="text-sm mt-1 font-medium text-gray-900">
          {formatPrice(`${product?.price}`)}
        </p>
      </div>
    </Link>
  );
};

const ProductListingPlaceHolder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
