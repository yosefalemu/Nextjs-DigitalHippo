import Link from "next/link";
import { cookies } from "next/headers";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import NavItems from "./NavItems";
import { buttonVariants } from "./ui/button";
import UserAccount from "./UserAccountNavbar";
import Cart from "./Cart";
import MobileNavbar from "./MobileNavbar";
import { getServerSideUser } from "@/lib/payload-utils";

const NavBar = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  return (
    <div className="sticky bg-white h-16 top-0 z-50 inset-x-0">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="h-16 flex items-center">
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Icons.logo className="h-10 w-10" />
                </Link>
              </div>
              <MobileNavbar user={user} />
              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>
              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <Link
                      href={"/sign-in"}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign in
                    </Link>
                  )}
                  {user ? null : (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}
                  {user ? (
                    <UserAccount user={user} />
                  ) : (
                    <Link
                      href={"/sign-up"}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Create account
                    </Link>
                  )}
                  {user ? (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  ) : null}
                  {user ? null : (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}
                  <div className="ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default NavBar;
