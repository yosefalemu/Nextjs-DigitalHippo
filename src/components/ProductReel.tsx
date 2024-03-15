"use client";
import { TQueryValidator } from "@/validators/query-validators";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Product } from "@/payload-types";
import ProductListing from "./ProductListing";

interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
}
const FALLBACK_LIMIT = 4;
const ProductReel = ({ title, subtitle, href, query }: ProductReelProps) => {
  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query?.limit ?? FALLBACK_LIMIT,
        query,
      },
      { getNextPageParam: (lastPage) => lastPage.nextPage }
    );
  console.log("product found", queryResults);
  const products = queryResults?.pages.flatMap((page) => page.items);
  console.log("second products found", products);

  let map: (Product | null)[] = [];
  if (products && products.length) {
    map = products;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  console.log("map element", map);

  return (
    <div className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>
      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-4 lg:gap-x-8 gap-y-10">
            {map.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReel;
