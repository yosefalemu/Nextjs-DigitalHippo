import { formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { BadgePercent, Loader2 } from "lucide-react";
import { Rate } from "@/payload-types";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface PaymentBottomProps {
  distance: string | null;
  cartTotal: number;
  isMounted: boolean;
  productIds: string[];
  shippingId: string;
}

const PaymentBottom = ({
  distance,
  cartTotal,
  isMounted,
  productIds,
  shippingId,
}: PaymentBottomProps) => {
  const router = useRouter();
  const { data: ratesFound } = trpc.rate.getRate.useQuery();
  console.log("rate FOUND", ratesFound);
  const rate = ratesFound?.rateAvailables[0];
  console.log("RATE", rate);

  const priceForDiscount = rate?.priceForDiscount ? rate.priceForDiscount : 0;
  const ratesPerKM = rate?.pricePerKilometer ? rate.pricePerKilometer : 0;
  const shippingFee =
    (rate?.pricePerKilometer ? rate.pricePerKilometer : 0) *
    (distance ? parseFloat(distance) : 0);
  const percentageDiscount = rate?.percentageDiscount
    ? rate.percentageDiscount / 100
    : 0;
  const reducedMoney =
    cartTotal >= priceForDiscount ? cartTotal * percentageDiscount : 0;

  const vatAmount = cartTotal * 0.15;

  const { mutate: CreateCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url);
      },
      onError: () => {
        console.log("ERROR");
      },
    });

  console.log("PRODUCTS IDS", productIds);

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-4xl font-medium text-gray-900 text-center">
        Payment summary
      </h2>
      {cartTotal >= priceForDiscount ? (
        <div className="md:flex items-center gap-2 justify-center mt-2">
          <BadgePercent className="text-green-500" />
          <h2 className="text-lg font-medium text-green-500">Discount exist</h2>
        </div>
      ) : (
        <div className="md:flex items-center gap-2 justify-center mt-2">
          <BadgePercent className="text-red-500" />
          <h2 className="text-lg font-medium text-red-500">
            Discount does not exist
          </h2>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Subtotal</span>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {isMounted ? (
              formatPrice(cartTotal)
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Total distance</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {isMounted ? (
              distance + " KM"
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Shipping cost per KM</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {isMounted ? (
              formatPrice(ratesPerKM)
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Shipping Cost</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {isMounted ? (
              formatPrice(shippingFee)
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Discount Available</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {isMounted ? (
              formatPrice(reducedMoney)
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Total Price</div>
          <div className="text-base font-medium text-gray-900">
            {isMounted ? (
              formatPrice(cartTotal + shippingFee - reducedMoney)
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        <div>
          {isLoading ? (
            <Button className="w-full mt-6" size="lg" disabled={isLoading}>
              Processing
              <Loader2 size={22} className="animate-spin text-zinc-300 ml-2" />
            </Button>
          ) : (
            <Button
              className="w-full mt-6"
              size="lg"
              onClick={() =>
                CreateCheckoutSession({
                  productIds,
                  shippingId,
                  couponId: rate?.discountId ? rate.discountId : "",
                  shippingFee,
                  distance: distance ? distance : "",
                  cartTotal,
                  priceForDiscount,
                })
              }
            >
              Continue to pay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default PaymentBottom;
