import { PRODUCT_CATEGORIES } from "@/config";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Category = (typeof PRODUCT_CATEGORIES)[number];
interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  handleClose: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}
const NavItem = ({
  category,
  handleOpen,
  handleClose,
  isOpen,
  isAnyOpen,
}: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          variant={isOpen ? "secondary" : "ghost"}
          onClick={handleOpen}
        >
          {category.label}
          <ChevronDown
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "rotate-180": isOpen,
            })}
          />
        </Button>
      </div>
      {isOpen ? (
        <div
          className={cn("absolute inset-0 top-full text-muted-foreground", {
            "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen,
          })}
        >
          <div className="inset-0 bg-white shadow" aria-hidden="true">
            <div className="relative bg-gray-50">
              <div className="mx-auto max-w-7xl px-8 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8 gap-y-8">
                  {category.featured.map((item, i) => (
                    <div
                      key={i}
                      className="group relative text-base sm:text-sm"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                        <Image
                          src={item?.imageSrc}
                          fill
                          className="object-cover object-center"
                          alt="product category image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
