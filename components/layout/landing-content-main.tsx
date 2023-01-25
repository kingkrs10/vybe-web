"use client";
// import TicketDetails from "@/components/layout/landing-ticket-details";
// import GuestDetails from "@/components/layout/guest-details";
// import PaymentDetails from "@/components/layout/payment-details";
import Tickets from "@/components/layout/tickets";
import { useAtom } from "jotai";
import { checkoutStepAtom } from "@/lib/atoms";
import dynamic from "next/dynamic";

const TicketDetails = dynamic(
  () => import("@/components/layout/landing-ticket-details"),
  {
    ssr: false,
  }
);
const GuestDetails = dynamic(
  () => import("@/components/layout/guest-details"),
  {
    ssr: false,
  }
);
const PaymentDetails = dynamic(
  () => import("@/components/layout/payment-details"),
  {
    ssr: false,
  }
);

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ");
// }

export default function LandingContent({
  id,
  session,
}: {
  id: string;
  session: any;
}) {
  const [step] = useAtom(checkoutStepAtom);
  return (
    <main className="py-6">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          {step == 1 && <TicketDetails id={id} />}
          {step == 2 && <GuestDetails id={id} session={session} />}
          {step == 3 && <PaymentDetails id={id} session={session} />}
        </div>
        <Tickets id={id} session={session} />
      </div>
    </main>
  );
}
