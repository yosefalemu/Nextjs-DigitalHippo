"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";
import {
  SignUpCredentialValidator,
  TSignUpCredentialValidator,
} from "@/validators/signup-validators";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<TSignUpCredentialValidator>({
    resolver: zodResolver(SignUpCredentialValidator),
  });

  const handleInputChange = (fieldName: string) => {
    clearErrors(fieldName as keyof TSignUpCredentialValidator);
  };

  const { mutate, isLoading, isSuccess } = trpc.auth.createUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error(err.message);
      }
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success("Verification link is send to your email");
      router.push("/verify-email?to=" + sentToEmail);
    },
  });

  const onSubmit = ({
    firstName,
    lastName,
    userName,
    email,
    password,
  }: TSignUpCredentialValidator) => {
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
                <div className="flex gap-2 py-2 relative">
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
                    className={cn(
                      {
                        "focus-visible:ring-red-600": errors.password,
                      },
                      "auto-rows-max"
                    )}
                    onChange={() => handleInputChange("password")}
                  />
                </div>
                {errors?.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
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
                  disabled={isSuccess}
                >
                  Sign in
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
