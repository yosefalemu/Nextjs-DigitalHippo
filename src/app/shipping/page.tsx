"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShippingValidator,
  TShippingValidator,
} from "@/validators/shipping-validator";
import Image from "next/image";
import { cn } from "@/lib/utils";

type IndividualCountry = {
  name: string;
  flag: string;
  root: string;
  suffix: Array<string>;
};

const Shipping = () => {
  const [selectedCountry, setSelectedCountry] =
    useState<IndividualCountry | null>(null);

  const {
    data: countryList,
    isLoading,
    isError,
  } = trpc.country.getCountry.useQuery();

  const basicCountriesProperties =
    countryList?.map((country: any) => ({
      name: country.name.common,
      flag: country.flags.png,
      root: country.idd.root,
      suffix: country.idd.suffixes,
    })) || [];

  const handleSelectCountry = (countryName: string) => {
    setSelectedCountry(
      basicCountriesProperties?.find(
        (item: IndividualCountry) => item.name === countryName
      )
    );
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<TShippingValidator>({
    resolver: zodResolver(ShippingValidator),
  });

  const handleInputChange = (fieldName: string) => {
    clearErrors(fieldName as keyof TShippingValidator);
  };

  const onSubmit = ({ city, country, phoneNumber }: TShippingValidator) => {
    console.log("Button clicked");
    console.log("COUNTRY", country, city, phoneNumber);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 pt-16">
        <div className="flex flex-col items-center space-y-1">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Address Form
          </h1>
          <p>Please fill all required fields carefully</p>
          <div className="pt-4 grid gap-6 w-full sm:w-[380px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2 py-2">
                <Label htmlFor="country" className="text-md">
                  Country
                </Label>
                {isLoading && (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                )}
                {!isLoading && !isError && (
                  <Input
                    {...register("country")}
                    placeholder="Search country..."
                    list="countries"
                    onChange={(e) => {
                      handleInputChange("country");
                      handleSelectCountry(e.target.value);
                    }}
                    className={cn({
                      "focus-visible:ring-red-600": errors.country,
                    })}
                  />
                )}
                <datalist id="countries">
                  {basicCountriesProperties.map(
                    (item: IndividualCountry, index: number) => (
                      <option key={index} value={item.name} />
                    )
                  )}
                </datalist>
                {errors.country && (
                  <p className="text-red-500">{errors.country.message}</p>
                )}
              </div>
              <div className="grid gap-2 py-2">
                {isLoading || !selectedCountry ? (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                ) : selectedCountry ? (
                  <>
                    <Label htmlFor="phoneNumber" className="text-md">
                      Phone number
                    </Label>
                    <div className="grid gap-x-3">
                      <div className="grid justify-center items-center border-b border-gray-900">
                        <Image
                          src={`${selectedCountry.flag}`}
                          width={50}
                          height={50}
                          alt={selectedCountry.name}
                        />
                      </div>
                      <div className="grid col-start-2 items-center border-b border-gray-900 justify-center">
                        {selectedCountry.root}
                        {selectedCountry.suffix}
                      </div>
                      <div className="grid col-start-3">
                        <Input
                          {...register("phoneNumber")}
                          placeholder="Enter your phone number"
                          className={cn("w-full h-full px-2 py-3", {
                            "focus-visible:ring-red-600": errors.phoneNumber,
                          })}
                          onChange={() => handleInputChange("phoneNumber")}
                        />
                      </div>
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </>
                ) : null}
              </div>
              <div className="grid gap-2 py-2">
                {isLoading ? (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                ) : (
                  <>
                    <Label htmlFor="city" className="text-md">
                      City
                    </Label>
                    <Input
                      placeholder="Addis Ababa"
                      {...register("city")}
                      onChange={() => handleInputChange("city")}
                    />
                    {errors.city && (
                      <p className="text-red-500">{errors.city.message}</p>
                    )}
                  </>
                )}
              </div>
              <div className="grid py-2">
                <Button
                  className={buttonVariants({
                    size: "lg",
                    className: "disabled:cursor-not-allowed w-full",
                  })}
                >
                  Checkout
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
