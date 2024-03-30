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
import {
  Country,
  City,
  State,
  ICity,
  ICountry,
  IState,
} from "country-state-city";

type IndividualCountry = {
  name: string;
  flag: string;
};

const Shipping = () => {
  const { addShippingState } = useShipping();
  const router = useRouter();
  const allCountry = Country.getAllCountries();

  const [selectedCountry, setSelectedCountry] =
    useState<IndividualCountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | undefined>(
    undefined
  );
  const [countryState, setCountryState] = useState<IState[] | undefined>(
    undefined
  );
  const [stateCity, setStateCity] = useState<ICity[] | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState<ICity | undefined>(
    undefined
  );

  const {
    data: countryList,
    isLoading: countryLoading,
    isError: countryError,
  } = trpc.country.getCountry.useQuery();

  const basicCountriesProperties =
    countryList?.map((country: any) => ({
      name: country.name.common,
      flag: country.flags.png,
    })) || [];

  const handleSelectCountry = (countryName: string) => {
    setSelectedCountry(
      basicCountriesProperties?.find(
        (item: IndividualCountry) => item.name === countryName
      )
    );
  };

  const handleSelectState = (stateName: string) => {
    setSelectedState(
      countryState?.find((item: IState) => item.name === stateName)
    );
  };

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(stateCity?.find((item: ICity) => item.name === cityName));
  };

  const mainSelectedCountry: ICountry | undefined = allCountry.find(
    (item) => item.name === selectedCountry?.name
  );

  useEffect(() => {
    const isoCode = mainSelectedCountry?.isoCode
      ? mainSelectedCountry.isoCode
      : "";
    const countryState: IState[] | undefined =
      State.getStatesOfCountry(isoCode);
    setCountryState(countryState);
  }, [mainSelectedCountry?.isoCode]);

  useEffect(() => {
    const currentCountryIsoCode = mainSelectedCountry?.isoCode
      ? mainSelectedCountry.isoCode
      : "";
    const currentStateIsoCode = selectedState?.isoCode
      ? selectedState.isoCode
      : "";
    const currentStateCities = City.getCitiesOfState(
      currentCountryIsoCode,
      currentStateIsoCode
    );
    setStateCity(currentStateCities);
  }, [selectedState?.isoCode]);

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
      console.log("DATA FOR SUCCESS", data);
      const shippingItem = data.createdShipping;
      addShippingState(shippingItem);
      toast.success("Shipping");
      const timeOut = setTimeout(() => {
        router.push("/payment");
      }, 3000);
      return () => clearTimeout(timeOut);
    },
    onError: (err) => {
      console.log("ERROR FOR SUBMIT", err);
      console.log(err);
    },
  });

  const onSubmit = ({
    city,
    country,
    phoneNumber,
    state,
    latitude,
    longitude,
  }: TShippingValidator) => {
    console.log("CITY", city);
    console.log("COUNTRY", country);
    console.log("PHONENUMBER", phoneNumber);
    console.log("STATE", state);
    console.log("LATITUDE", latitude);
    console.log("LONGITUDE", longitude);
    mutate({
      city,
      country,
      phoneNumber,
      state,
      latitude,
      longitude,
    });
  };
  console.log("COUNTRIES", mainSelectedCountry);
  console.log("COUNTRYSTATES", countryState);
  console.log("SELECTED CITY", selectedCity);
  console.log("SELECTED COUNTRY", selectedCountry);
  console.log("SELECTED STATE", selectedState);
  console.log("ERROR WHILE CREATING SHIPPING", errorCreateShipping);

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
                    id="country"
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
                <Label htmlFor="phoneNumber" className="text-md">
                  Phone number
                </Label>
                {countryLoading || !selectedCountry ? (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                ) : (
                  <div className="grid gap-x-3">
                    <div className="grid justify-center items-center border-b border-gray-900">
                      <Image
                        src={`${selectedCountry?.flag}`}
                        width={50}
                        height={50}
                        alt={selectedCountry?.name}
                      />
                    </div>
                    <div className="grid col-start-2 items-center border-b border-gray-900 justify-center text-sm">
                      {mainSelectedCountry ? (
                        "+" + mainSelectedCountry.phonecode
                      ) : (
                        <Skeleton className="w-full h-[50px] rounded-sm" />
                      )}
                    </div>
                    <div className="grid col-start-3">
                      <Input
                        id="phoneNumber"
                        {...register("phoneNumber")}
                        placeholder="Enter your phone number"
                        className={cn("w-full h-full px-2 py-3", {
                          "focus-visible:ring-red-600": errors.phoneNumber,
                        })}
                        onChange={() => handleInputChange("phoneNumber")}
                      />
                    </div>
                  </div>
                )}
                {errors.phoneNumber && (
                  <p className="text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="state" className="text-md">
                  State
                </Label>
                {countryLoading || !selectedCountry ? (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                ) : (
                  <>
                    <Input
                      id="state"
                      {...register("state")}
                      placeholder="Search country..."
                      list="states"
                      onChange={(e) => {
                        handleInputChange("state");
                        handleSelectState(e.target.value);
                      }}
                      className={cn({
                        "focus-visible:ring-red-600": errors.state,
                      })}
                    />
                    <datalist id="states">
                      {countryState?.map((item: IState, index: number) => (
                        <option key={index} value={item.name} />
                      ))}
                    </datalist>
                    {errors.country && (
                      <p className="text-red-500">{errors.state?.message}</p>
                    )}
                  </>
                )}
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="city" className="text-md">
                  City
                </Label>
                {countryLoading || !selectedCountry || !selectedState ? (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                ) : (
                  <>
                    <Input
                      id="city"
                      placeholder="Addis Ababa"
                      {...register("city")}
                      list="cities"
                      onChange={(e) => {
                        handleInputChange("city");
                        handleSelectCity(e.target.value);
                      }}
                    />
                    <datalist id="cities">
                      {stateCity?.map((item: ICity, index: number) => (
                        <option key={index} value={item.name} />
                      ))}
                    </datalist>
                    {errors.city && (
                      <p className="text-red-500">{errors.city.message}</p>
                    )}
                  </>
                )}
              </div>
              <div className="grid py-2">
                <Label htmlFor="city" className="text-md">
                  Latitude
                </Label>
                {!selectedCity && (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                )}
                {selectedCity && (
                  <Input
                    {...register("latitude")}
                    value={selectedCity?.latitude ? selectedCity.latitude : ""}
                  />
                )}
              </div>
              <div className="grid py-2">
                <Label htmlFor="city" className="text-md">
                  Longitude
                </Label>
                {!selectedCity && (
                  <Skeleton className="w-full h-[50px] rounded-sm" />
                )}
                {selectedCity && (
                  <Input
                    {...register("longitude")}
                    value={
                      selectedCity?.longitude ? selectedCity.longitude : ""
                    }
                  />
                )}
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
                    type="submit"
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
