"use client";
import { useEffect, useState } from "react";
import GuestFields from "@/components/layout/guest-fields";
import { useAtom } from "jotai";
import {
  ticketsAtom,
  checkoutStepAtom,
  guestFilledAtom,
  guestsAtom,
  totalAtom,
  completedPurchaseAtom,
  clientSecretAtom,
} from "@/lib/atoms";
import ApiClient from "@/lib/axios";

export default function GuestDetails({
  id,
  session,
}: {
  id: any;
  session: any;
}) {
  const [count, setCount] = useAtom(ticketsAtom);
  const [step, setStep] = useAtom(checkoutStepAtom);
  const [isFilled, setFilled] = useAtom(guestFilledAtom);
  const [guests, setGuests] = useAtom(guestsAtom);

  const [total, setTotal] = useAtom(totalAtom);
  const [tickets, setTickets] = useAtom(ticketsAtom);
  const [purchase, setPurchase] = useAtom(completedPurchaseAtom);
  const [clientSecret, setClientSecret] = useAtom(clientSecretAtom);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let filled = [];
    guests.map((item: any) => {
      if (item.name === "" || item.email === "") {
        filled.push(false);
      } else {
        filled.push(true);
      }
    });

    if (filled.includes(false)) {
      setFilled(false);
    } else {
      setFilled(true);
    }
  }, [guests, setFilled]);

  const handleSubmit = async (event: any) => {
    // event.preventDefault();
    try {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      const transaction = await ApiClient(user?.token).post(`/transactions`, {
        guests: guests,
        total: total,
        eventId: id,
        ticketsSold: guests.length,
        userId: user?.data?.userId,
        customerId: user?.data?.stripeCustomerId,
        name: `${user?.data?.firstName} ${user?.data?.lastName}`,
        email: `${user?.data?.emailAddress}`,
      });
      if (transaction.data.data.transactionId) {
        setGuests([]);
        setTotal({});
        setTickets([]);
        setClientSecret("");
        setStep(1);
        setPurchase(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section
      aria-labelledby="timeline-title"
      className="lg:col-span-1 lg:col-start-3"
    >
      <div className="bg-white p-6 shadow sm:rounded-lg">
        <form className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h2 className="text-2xl leading-6 text-gray-900">
                  Guest details
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  We will use this information to fill in your order and email
                  your e-ticket.
                </p>
              </div>
              <div className="">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Full name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      defaultValue={session?.name}
                      autoComplete="given-name"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Email address
                  </label>
                  <div className="mt-0 sm:col-span-2 sm:mt-0">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={session?.email}
                      autoComplete="email"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
              <div>
                <h3 className="text-lg  leading-6 text-gray-900">
                  Assign tickets
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Based on your number of tickets, you can assign each ticket to
                  others you wish to attend this event via invite.
                </p>
                {/* <p>{JSON.stringify(guests)}</p> */}
              </div>
              {count
                .filter((item: any) => {
                  return item.event == id && item.quantity > 0;
                })
                .map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <GuestFields item={item} />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                }}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isFilled}
                onClick={(e) => {
                  e.preventDefault();
                  if (isFilled === true && total.total > 0) {
                    setStep(3);
                  } else {
                    handleSubmit();
                  }
                }}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
