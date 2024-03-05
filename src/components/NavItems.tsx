"use client";
import { useState, useRef, useEffect } from "react";

import { PRODUCT_CATEGORIES } from "@/config";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-onclick-ouside-div";

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isAnyOpen = activeIndex !== null;
  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => setActiveIndex(null));

  // useEffect(() => {
  //   const handler = (e: KeyboardEvent) => {
  //     console.log(e.key);

  //     if (e.key === "Escape") {
  //       console.log("pressed key", e.key);

  //       setActiveIndex(null);
  //     }
  //   };

  //   document.addEventListener("keydown", handler);

  //   return () => {
  //     document.removeEventListener("keydown", handler);
  //   };
  // }, []);

  return (
    <div className="flex h-full items-center gap-4" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, i) => {
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIndex(null);
          } else {
            setActiveIndex(i);
          }
        };

        const handleClose = () => setActiveIndex(null);

        const isOpen = i === activeIndex;
        return (
          <div key={i}>
            <NavItem
              category={category}
              handleOpen={handleOpen}
              handleClose={handleClose}
              isOpen={isOpen}
              isAnyOpen={isAnyOpen}
              key={category.value}
            />
          </div>
        );
      })}
    </div>
  );
};

export default NavItems;
