"use client";
import Tickets from "@/components/layout/tickets";
import { useAtom } from "jotai";
import { checkoutStepAtom, completedPurchaseAtom } from "@/lib/atoms";
import dynamic from "next/dynamic";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import TicketDetails from "@/components/layout/landing-ticket-details";

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

export default function LandingContent({
  event,
  tickets,
  session,
}: {
  event: any;
  tickets: any;
  session: any;
}) {
  const [step] = useAtom(checkoutStepAtom);
  const [purchase, setPurchase] = useAtom(completedPurchaseAtom);

  useEffect(() => {}, [step]);

  return (
    <main className="py-6">
      {purchase && (
        <div className="mx-auto mb-6 max-w-3xl sm:px-6 lg:max-w-7xl">
          <div className="rounded-md border border-green-200 bg-green-100 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Thank you! You have successfully completed your ticket
                  purchase.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    // type="button"
                    onClick={() => {
                      setPurchase(false);
                    }}
                    className="inline-flex rounded-md bg-green-200 p-1.5 text-green-500 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          {step == 1 && <TicketDetails data={event} session={session} />}
          {step == 2 && <GuestDetails id={event.eventId} session={session} />}
          {step == 3 && (
            <PaymentDetails
              ticket={event}
              // currency={event.currency}
              session={session}
            />
          )}
        </div>
        <Tickets
          tickets={tickets}
          id={event.eventId}
          currency={event.currency}
          session={session}
        />
      </div>
    </main>
  );
}
