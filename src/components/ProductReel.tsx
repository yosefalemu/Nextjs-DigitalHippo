"use client";
import { TQueryValidator } from "@/validators/query-validators";
import { trpc } from "@/trpc/client";
import Link from "next/link";

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

  return (
    <div className="py-12 border border-red-600">
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
        <Link
          href={"test"}
          className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
        >
          Shop the collection
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="relative">
        <div className="mt-6 flex items-center w-full border border-violet-600">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 sm:gap-x-6 gap-x-4 lg:gap-x-8 gap-y-10">
            <h1 className="border border-yellow-500">Test</h1>
            <h1 className="border border-yellow-500">Test</h1>
            <h1 className="border border-yellow-500">Test</h1>
            <h1 className="border border-yellow-500">Test</h1>
            <h1 className="border border-yellow-500">Test</h1>
            <h1 className="border border-yellow-500">Test</h1>
            <h1 className="border border-yellow-500">Test</h1>
            <h1 className="border border-yellow-500">Test</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReel;
