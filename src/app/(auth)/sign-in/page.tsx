"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SignIn = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const handleSubmit = () => {
    console.log("Function called");
  };
  return (
    <div className="container relative flex items-center justify-center pt-20 lg:px-0">
      <div className="flex flex-col justify-center w-full sm:w-[350px] space-y-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-2">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl tracking-tight font-semibold">
            Access your account
          </h1>
          <Link
            href={"/sign-up"}
            className={buttonVariants({ variant: "link", className: "gap-1" })}
          >
            Don't have an account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-2 py-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center justify-center gap-2">
                  <Input
                    placeholder="you@example.com"
                    className={cn({ "focus-visible:ring-red-600": true })}
                  />
                  <Mail className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center justify-center gap-2">
                  <Input
                    placeholder="Password"
                    type={visible ? "text" : "password"}
                    className={cn({ "focus-visible:ring-red-600": true })}
                  />
                  {visible ? (
                    <Eye
                      className="h-10 w-10 cursor-pointer text-primary"
                      onClick={() => setVisible(!visible)}
                    />
                  ) : (
                    <EyeOff
                      className="h-10 w-10 cursor-pointer text-primary"
                      onClick={() => setVisible(!visible)}
                    />
                  )}
                </div>
              </div>
              <Button className={buttonVariants({ size: "lg" })}>
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
