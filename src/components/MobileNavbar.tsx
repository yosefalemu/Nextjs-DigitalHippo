"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRef } from "react";

import { PRODUCT_CATEGORIES } from "@/config";
import { useOnClickOutside } from "@/hooks/use-onclick-ouside-div";

const MobileNavbar = () => {
  const [isOpen, setIsopen] = useState<boolean>(false);
  const mobileNavbarRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(mobileNavbarRef, () => setIsopen(false));

  if (!isOpen) {
    return (
      <button
        className="lg:hidden relative inline-flex items-center justify-end rounded-md p-2 text-gray-400 grow"
        onClick={() => setIsopen(true)}
      >
        <Menu />
      </button>
    );
  }
  return (
    <div className="grow lg:hidden">
      <div className="relative z-40 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-75" />
      </div>

      <div className="fixed right-0 top-0 overflow-y-scroll overscroll-y-none inset-0 z-40 flex justify-end">
        <div className="w-4/5 md:w-3/5" ref={mobileNavbarRef}>
          <div className="relative flex w-full flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex justify-end px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setIsopen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-2">
              <ul>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li
                    key={category.label}
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    <div className="border-b border-gray-200">
                      <div className="-mb-px flex">
                        <p className="border-transparent text-gray-900 flex-1 whitespace-nowrap border-b-2 py-4 text-base font-medium">
                          {category.label}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-10 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                            <Image
                              fill
                              src={item.imageSrc}
                              alt="product category image"
                              className="object-cover object-center"
                            />
                          </div>
                          <Link
                            href={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <Link
                  //   onClick={() => closeOnCurrent('/sign-in')}
                  href="/sign-in"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Sign in
                </Link>
              </div>
              <div className="flow-root">
                <Link
                  //   onClick={() => closeOnCurrent('/sign-up')}
                  href="/sign-up"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
