"use client";
import React, { useEffect } from "react";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/trpc/client";
import {
  SignInCredentialValidator,
  TSignInCredentialValidator,
} from "@/validators/signin-validators";
import { useRouter, useSearchParams } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const continueAsSeller = () => {
    router.push("?as=seller");
  };
  const continueAsBuyer = () => {
    router.push("/sign-in");
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<TSignInCredentialValidator>({
    resolver: zodResolver(SignInCredentialValidator),
  });

  const handleInputChange = (fieldName: string) => {
    clearErrors(fieldName as keyof TSignInCredentialValidator);
  };
  useEffect(() => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 4000);
  }, [error, success]);

  const { isError, isLoading, mutate } = trpc.auth.signIn.useMutation({
    onError: (err: any) => {
      console.log("Login error in signin", err.message);
      setError(err.message);
    },
    onSuccess: () => {
      setSuccess("Signed in successfully");
      router.refresh();
      if (origin) {
        router.push(`/${origin}`);
        return;
      }
      if (isSeller) {
        router.push("/sell");
        return;
      }
      setTimeout(() => {
        router.push("/");
      }, 4000);
    },
  });

  const onSubmit = ({ email, password }: TSignInCredentialValidator) => {
    console.log("email", email);
    console.log("password", password);
    mutate({ email, password });
  };

  return (
    <div className="container relative flex items-center justify-center pt-20 lg:px-0">
      <div className="flex flex-col justify-center w-full sm:w-[350px] space-y-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-2">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl tracking-tight font-semibold">
            Sign in to your {isSeller ? "seller" : ""} account
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
          {error && (
            <p className="bg-red-500 text-white px-3 py-2 rounded-sm text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="bg-green-500 text-white px-3 py-2 rounded-sm text-center">
              {success}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-2 py-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center justify-center gap-2 relative">
                  <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                    <Mail size={22} className="text-primary" />
                  </div>
                  <Input
                    {...register("email")}
                    placeholder="you@example.com"
                    className={cn({
                      "focus-visible:ring-red-600": errors.email,
                    })}
                    onChange={() => handleInputChange("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center justify-center gap-2 relative">
                  <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                    {visible ? (
                      <EyeOff
                        size={22}
                        className="cursor-pointer text-primary"
                        onClick={() => setVisible(!visible)}
                      />
                    ) : (
                      <Eye
                        size={22}
                        className="cursor-pointer text-primary"
                        onClick={() => setVisible(!visible)}
                      />
                    )}
                  </div>
                  <Input
                    {...register("password")}
                    placeholder="Password"
                    type={visible ? "text" : "password"}
                    className={cn({
                      "focus-visible:ring-red-600": errors.password,
                    })}
                    onChange={() => handleInputChange("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              {isLoading ? (
                <Button
                  className={buttonVariants({
                    size: "lg",
                    className: "disabled:cursor-not-allowed",
                  })}
                  disabled={isLoading}
                >
                  Processing
                  <Loader2
                    size={22}
                    className="animate-spin text-zinc-300 ml-2"
                  />
                </Button>
              ) : (
                <Button
                  className={buttonVariants({
                    size: "lg",
                    className: "disabled:cursor-not-allowed",
                  })}
                  disabled={error !== "" || success !== ""}
                >
                  Sign in
                </Button>
              )}
            </div>
          </form>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          {isSeller ? (
            <Button variant={"secondary"} onClick={continueAsBuyer}>
              Continue as buyer
            </Button>
          ) : (
            <Button variant={"secondary"} onClick={continueAsSeller}>
              Continue as seller
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
