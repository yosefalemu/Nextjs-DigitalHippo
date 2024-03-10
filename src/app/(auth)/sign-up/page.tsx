"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";
import {
  AuthCredentialValidator,
  TAuthCredentialValidator,
} from "@/validators/auth-validators";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(AuthCredentialValidator),
  });

  const handleInputChange = (fieldName: string) => {
    console.log("handle Input change", fieldName);
    clearErrors(fieldName as keyof TAuthCredentialValidator);
  };

  const { mutate, isLoading } = trpc.auth.createUser.useMutation({
    onError: (err) => {
      console.log("Error in signup", err.message);

      if (err.data?.code === "CONFLICT") {
        setError(err.message);
        return;
      }
    },
    // onSuccess: ({ sendToEmail }) => {
    //   router.push("/verify-email?to=" + sendToEmail);
    // },
  });

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 6000);
  }, [error]);

  const onSubmit = ({
    firstName,
    lastName,
    userName,
    email,
    password,
  }: TAuthCredentialValidator) => {
    console.log("email", email);
    mutate({ firstName, lastName, userName, email, password });
  };

  return (
    <div className="container relative flex items-center justify-center pt-20 lg:px-0">
      <div className="flex flex-col justify-center w-full sm:w-[350px] space-y-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-2">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl tracking-tight font-semibold">
            Create an account
          </h1>
          <Link
            href={"/sign-in"}
            className={buttonVariants({ variant: "link", className: "gap-1" })}
          >
            Already have an account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {error && (
          <div className="bg-red-600 text-white rounded-sm p-2">{error}</div>
        )}
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-2 py-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="grid gap-1 py-2">
                  <Input
                    {...register("firstName")}
                    placeholder="Yosef"
                    type="text"
                    className={cn({
                      "focus-visible:ring-red-600": errors.firstName,
                    })}
                    onChange={() => handleInputChange("firstName")}
                  />
                  {errors?.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="firstName">Last Name</Label>
                <div className="grid gap-1 py-2">
                  <Input
                    {...register("lastName")}
                    placeholder="Alemu"
                    type="text"
                    className={cn({
                      "focus-visible:ring-red-600": errors.lastName,
                    })}
                    onChange={() => handleInputChange("lastName")}
                  />
                  {errors?.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="firstName">User Name</Label>
                <div className="grid gap-1 py-2">
                  <Input
                    {...register("userName")}
                    placeholder="Joseph21"
                    type="text"
                    className={cn({
                      "focus-visible:ring-red-600": errors.userName,
                    })}
                    onChange={() => handleInputChange("userName")}
                  />
                  {errors?.userName && (
                    <p className="text-sm text-red-500">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="email">Email</Label>
                <div className="grid gap-1 py-2">
                  <Input
                    {...register("email")}
                    placeholder="you@example.com"
                    className={cn({
                      "focus-visible:ring-red-600": errors.email,
                    })}
                    onChange={() => handleInputChange("email")}
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2 py-2">
                  <Input
                    {...register("password")}
                    placeholder="Password"
                    type={visible ? "text" : "password"}
                    className={cn(
                      {
                        "focus-visible:ring-red-600": errors.password,
                      },
                      "auto-rows-max"
                    )}
                    onChange={() => handleInputChange("password")}
                  />
                  {visible ? (
                    <EyeOff
                      className="h-10 w-10 cursor-pointer text-primary"
                      onClick={() => setVisible(!visible)}
                    />
                  ) : (
                    <Eye
                      className="h-10 w-10 cursor-pointer text-primary"
                      onClick={() => setVisible(!visible)}
                    />
                  )}
                </div>
                {errors?.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {isLoading ? (
                <Button className={(buttonVariants({ size: "lg" }), "mb-36")}>
                  Loading...
                </Button>
              ) : (
                <Button className={(buttonVariants({ size: "lg" }), "mb-36")}>
                  Sign up
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
