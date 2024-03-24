"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShippingValidator,
  TShippingValidator,
} from "@/validators/shipping-validator";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useShipping } from "@/hooks/use-shipping";

type IndividualCountry = {
  name: string;
  flag: string;
  root: string;
  suffix: Array<string>;
};
type IndividualCity = {
  country: string;
  geonameid: number;
  name: string;
  subcountry: string;
};

const Shipping = () => {
  const { addShippingState } = useShipping();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] =
    useState<IndividualCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<IndividualCity | null>(null);
  const [cityInSelectedCountry, setCityInSelectedCountry] =
    useState<Array<object> | null>([]);

  const {
    data: countryList,
    isLoading: countryLoading,
    isError: countryError,
  } = trpc.country.getCountry.useQuery();

  const {
    data: cityList,
    isLoading: cityLoading,
    isError: cityError,
  } = trpc.country.getCity.useQuery();

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

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(
      cityList?.find((item: IndividualCity) => item.name === cityName)
    );
  };

  useEffect(() => {
    console.log("TESTED");
    const response = cityList
      ?.filter((item: any) => item.country === selectedCountry?.name)
      .sort();
    setCityInSelectedCountry(response);
  }, [selectedCountry, selectedCity]);

  const geonameId =
    selectedCity?.geonameid === undefined ? null : selectedCity.geonameid;
  const {
    data: dataForChange,
    isLoading: loadingForChange,
    isError: errorForChange,
  } = trpc.country.getCityLatitudeAndLongtiude.useQuery({ geonameId });

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

  const {
    mutate,
    isLoading: loadingCreateShipping,
    isSuccess,
    isError: errorCreateShipping,
    data,
  } = trpc.shipping.CreateShipping.useMutation({
    onSuccess: (data) => {
      const shippingItem = data.createdShipping;
      addShippingState(shippingItem);
      console.log("SHIPPINGiTEM", shippingItem);
      toast.success("Shipping");
      setTimeout(() => {
        router.push("/payment");
      }, 3000);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit = ({ city, country, phoneNumber }: TShippingValidator) => {
    mutate({ city, country, phoneNumber });
  };
  // console.log("COUNTRYLIST", countryList);
  // console.log("CITYLIST", cityList);
  // console.log("SELECTEDCOUNTRY", selectedCountry);
  // console.log("CITIES IN THE COUNTRY", cityInSelectedCountry);
  // console.log("SELECTEDCITY", selectedCity);
  console.log("DATAFORCHAGE", dataForChange);
  console.log("DATAFORCHANGELOADING", loadingForChange);
  console.log("DATAFORCHANGEEROOR", errorForChange);

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
                {countryLoading && (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                )}
                {!countryLoading && !countryError && (
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
                {countryLoading || !selectedCountry ? (
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
                {countryLoading || cityLoading || !selectedCountry ? (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                ) : cityInSelectedCountry ? (
                  <>
                    <Label htmlFor="city" className="text-md">
                      City
                    </Label>
                    {cityLoading && (
                      <Skeleton className="w-full h-[50px] rounded-sm" />
                    )}
                    {!cityLoading && !cityError && (
                      <Input
                        placeholder="Addis Ababa"
                        {...register("city")}
                        list="cities"
                        onChange={(e) => {
                          handleInputChange("city");
                          handleSelectCity(e.target.value);
                        }}
                      />
                    )}
                    <datalist id="cities">
                      {cityInSelectedCountry?.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.name} />
                        )
                      )}
                    </datalist>
                    {errors.city && (
                      <p className="text-red-500">{errors.city.message}</p>
                    )}
                  </>
                ) : null}
              </div>
              <div className="grid py-2">
                {loadingCreateShipping ? (
                  <Button
                    className={buttonVariants({
                      size: "lg",
                      className: "disabled:cursor-not-allowed w-full",
                    })}
                    disabled={loadingCreateShipping}
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
                      className: "disabled:cursor-not-allowed w-full",
                    })}
                    disabled={isSuccess}
                  >
                    Checkout
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
