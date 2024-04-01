"use client";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { buttonVariants } from "./ui/button";

interface PaymentStatusProps {
  isPaid: boolean;
  orderEmail: string;
  orderId: string;
}
const PaymentStatus = ({ isPaid, orderEmail, orderId }: PaymentStatusProps) => {
  const router = useRouter();
  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 1000),
    }
  );
  useEffect(() => {
    if (data?.isPaid) {
      router.refresh();
    }
  }, [data?.isPaid, router]);

  return (
    <div className="flex flex-col gap-y-3">
      <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
        <div>
          <p className="font-medium text-gray-900">Shipping To</p>
          <p>{orderEmail}</p>
        </div>

        <div>
          <p className="font-medium text-gray-900">Order Status</p>
          <p>{isPaid ? "Payment successful" : "Pending payment"}</p>
        </div>
      </div>
      <div className="border-t border-gray-500 text-center">
        <Link href={"/products"}>Continue shipping</Link>
      </div>
    </div>
  );
};
export default PaymentStatus;
