import { formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { BadgePercent, Loader2 } from "lucide-react";
import { Rate } from "@/payload-types";
import { Button } from "./ui/button";

interface PaymentBottomProps {
  distance: string | null;
  cartTotal: number;
  isMounted: boolean;
  productIds: string[];
}

const PaymentBottom = ({
  distance,
  cartTotal,
  isMounted,
  productIds,
}: PaymentBottomProps) => {
  const { data: ratesFound } = trpc.rate.getRate.useQuery();
  const rates = ratesFound?.rateAvailables[0];
  const ratesPerKM = rates?.pricePerKilometer ? rates.pricePerKilometer : 0;
  const priceForDiscount = rates?.priceForDiscount ? rates.priceForDiscount : 0;
  const discountAmount = rates?.discountAmount ? rates.discountAmount : 0;
  const reducedMoney =
    cartTotal >= priceForDiscount ? cartTotal * discountAmount : 0;
  const shippingCost =
    (rates?.pricePerKilometer ? rates.pricePerKilometer : 0) *
    (distance ? parseFloat(distance) : 0);

  const { mutate: CreateCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: () => {
        console.log("SUCCESS");
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
        <div className="mt-2 text-center">
          <h2 className="text-lg font-medium text-green-500">
            {` Since your total price is less than ${priceForDiscount} you don't have discount`}
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
              formatPrice(shippingCost)
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Discount Amount</span>
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
              formatPrice(cartTotal + shippingCost - reducedMoney)
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
              onClick={() => CreateCheckoutSession({ productIds })}
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
