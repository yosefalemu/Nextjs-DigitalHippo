import PaymentStatus from "@/components/PaymentStatus";
import { PRODUCT_CATEGORIES } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { Product, ProductFile, User } from "@/payload-types";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export const Thankyou = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;
  const session_id = searchParams.session_id;
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayloadClient();
  console.log("ORDER ID", orderId);

  if (!orderId || typeof orderId !== "string") {
    throw new Error("Invalid orderId");
  }
  await payload.update({
    collection: "orders",
    data: { _isPaid: true },
    where: { id: { equals: orderId } },
  });
  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: { equals: orderId },
    },
  });
  const [order] = orders;
  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  if (user?.id !== orderUserId) {
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(
    session_id as string
  );
  const metaData = stripeSession.metadata;
  console.log("STRIPE META DATA", metaData);

  return (
    <div className="relative">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">
              Order successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for ordering
            </h1>
            {order._isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available to
                download below. We&apos;ve sent your receipt and order details
                to{" "}
                {typeof order.user !== "string" ? (
                  <span className="font-medium text-gray-900">
                    {order.user.email}
                  </span>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currently processing
                it. So hang tight and we&apos;ll send you confirmation very
                soon!
              </p>
            )}
            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>
              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {(order.products as Product[]).map((product) => {
                  const label = PRODUCT_CATEGORIES.find(
                    ({ value }) => value === product.category
                  )?.label;
                  const downloadUrl = (product.product_files as ProductFile)
                    .url as string;
                  console.log("DOWLOAD URL", downloadUrl);
                  const { image } = product.images[0];
                  console.log("IMAGES", image);
                  return (
                    <div
                      key={product.id}
                      className="flex justify-between space-x-6 py-6"
                    >
                      <div className="relative h-32 w-32 flex-auto">
                        {" "}
                        {typeof image !== "string" && image.url ? (
                          <Image
                            src={image.url}
                            alt={`${product.name} image`}
                            fill
                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                          />
                        ) : null}
                      </div>
                      <div className="flex-col gap-y-4">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>

                          <p className="my-1">Category: {label}</p>
                        </div>
                        <p className="flex-none font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </ul>
              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Country</p>
                  <p className="text-gray-900">{metaData?.country}</p>
                </div>
                <div className="flex justify-between">
                  <p>City</p>
                  <p className="text-gray-900">{metaData?.city}</p>
                </div>
                <div className="flex justify-between">
                  <p>Distance</p>
                  <p className="text-gray-900">{`${metaData?.distance} Km`}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total Price</p>
                  <p className="text-base">
                    {formatPrice(
                      parseFloat(
                        metaData?.totalPrice ? metaData.totalPrice : "0"
                      )
                    )}
                  </p>
                </div>
              </div>
              <PaymentStatus
                isPaid={order._isPaid}
                orderEmail={(order.user as User).email}
                orderId={order.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Thankyou;
