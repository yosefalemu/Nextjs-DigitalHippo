"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "@/payload-types";
import { ExternalLink, LogOut } from "lucide-react";

const UserAccountNavbar = ({ user }: { user: User }) => {
  const { signOut } = useAuth();
  const handleLogout = () => {
    signOut();
  };
  console.log("user in user account navbar", user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant={"secondary"} size={"sm"} className="relative">
          {user?.userName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-black">{user?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/sell">
            <ExternalLink size={22} className="text-primary mr-2" />
            Seller Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 hover:text-red-600"
        >
          <LogOut className="text-red-600 mr-2" size={22} />
          log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNavbar;
