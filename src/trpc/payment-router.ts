import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import type Stripe from "stripe";
import { stripe } from "../lib/stripe";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
        shippingId: z.string(),
        shippingFee: z.number(),
        couponId: z.string(),
        distance: z.string(),
        cartTotal: z.number(),
        priceForDiscount: z.number(),
        totalPrice: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        productIds,
        shippingId,
        couponId,
        distance,
        shippingFee,
        cartTotal,
        priceForDiscount,
        totalPrice,
      } = input;
      const { user } = ctx;
      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const payload = await getPayloadClient();
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: { in: productIds },
        },
      });
      const { docs: shippingDetail } = await payload.find({
        collection: "shipping",
        where: {
          id: { equals: shippingId },
        },
      });
      console.log("PRODUCTS", products);
      console.log("Additional cost");
      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));
      console.log("FILTERED PRODUCTS", filteredProducts);

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
          shipping: shippingId,
        },
      });
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
          adjustable_quantity: {
            enabled: false,
          },
        });
      });
      try {
        console.log("TRY THIS");
        const discounts =
          cartTotal >= priceForDiscount ? [{ coupon: couponId }] : [];
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
            country: shippingDetail[0].country!,
            city: shippingDetail[0].city!,
            distance: distance,
            totalPrice: totalPrice,
          },
          line_items,
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: {
                  amount: Math.round(shippingFee * 100),
                  currency: "USD",
                },
                display_name: "Reliable shipping",
              },
            },
          ],
          discounts,
        });
        console.log("STRIPE SESSIONS", stripeSession);

        return { url: stripeSession.url };
      } catch (err) {
        console.log("ERROR FOUND", err);
        return { url: null };
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { orderId } = input;
      console.log("ORDERID", orderId);
      const payload = await getPayloadClient();
      const { docs: orders } = await payload.find({
        collection: "orders",
        where: { id: { equals: orderId } },
      });
      if (orders.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const [order] = orders;
      return { isPaid: order._isPaid };
    }),
});
