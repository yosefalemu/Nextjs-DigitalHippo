"use client";
import { useShipping } from "@/hooks/use-shipping";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@/config";
import { Check } from "lucide-react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useState, useEffect } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";

const Payment = () => {
  const { shippingAddress } = useShipping();
  const { items } = useCart();
  const mapRef = useRef(null);
  const [distance, setDistance] = useState<string | null>(null);
  const constantLatitude = 9.033;
  const constantLongitude = 38.75;
  const latitude = 11.1333;
  const longitude = 39.6333;

  // Function to calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  useEffect(() => {
    const distance = calculateDistance(
      constantLatitude,
      constantLongitude,
      latitude,
      longitude
    );
    setDistance(distance.toFixed(2));
  }, [latitude, longitude]);

  const customIcon = new Icon({
    iconUrl: "./location.png",
    iconSize: [28, 28],
  });
  const markers = [
    {
      geocode: [constantLatitude, constantLongitude],
      popUp: "Starting point",
    },
    {
      geocode: [latitude, longitude],
      popUp: "Destination point",
    },
  ];
  console.log("DISTANCE", distance);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Overall page
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-5">
            <h2 className="sr-only">Items in your shopping cart</h2>
            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  true,
              })}
            >
              {items.map(({ product }) => {
                const label = PRODUCT_CATEGORIES.find(
                  (c) => c.value === product.category
                )?.label;

                const { image } = product.images[0];

                return (
                  <li
                    key={product.id}
                    className="flex items-center py-6 sm:py-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="relative h-32 w-32">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            fill
                            src={image.url}
                            alt="product image"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col ml-4 sm:ml-6 space-y-2">
                      <h3 className="text-lg font-medium text-gray-700 hover:text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground">Category: {label}</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                      <p className="flex space-x-2 text-sm text-gray-700">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="grid col-span-7 z-0 overflow-hidden border border-red-500">
            <MapContainer
              center={[latitude, longitude]}
              zoom={13}
              ref={mapRef}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline
                positions={[
                  [constantLatitude, constantLongitude],
                  [latitude, longitude],
                ]}
                color="red"
              />
              <Marker
                position={[constantLatitude, constantLongitude]}
                icon={customIcon}
              >
                <Popup>Starting Point</Popup>
              </Marker>
              <Marker position={[latitude, longitude]} icon={customIcon}>
                <Popup>Destination Point</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
