"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useAtom } from "jotai";
import {
  ticketsAtom,
  checkoutStepAtom,
  guestFilledAtom,
  guestsAtom,
} from "@/lib/atoms";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {} from "@stripe/react-stripe-js";
import { XCircleIcon } from "@heroicons/react/20/solid";

export default function PaymentForm({}: {}) {
  const [clientSecret, setClientSecret] = useState<any>();
  const [total, setTotal] = useState<any>([]);
  const [count, setCount] = useAtom(ticketsAtom);
  const [step, setStep] = useAtom(checkoutStepAtom);
  const [isFilled] = useAtom(guestFilledAtom);
  const [guests, setGuests] = useAtom(guestsAtom);
  const [errorMessage, setErrorMessage] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      setStep(4);
    }
  };
  //   const router = useRouter();
  //   const pathname = usePathname();

  return (
    <form>
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {errorMessage}
              </h3>
            </div>
          </div>
        </div>
      )}
      <PaymentElement
        options={{
          layout: {
            type: "accordion",
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: false,
          },
          //   appearance: { theme: "stripe" },
        }}
      />
      {/* <button disabled={!stripe}>Submit</button> */}
      {/* Show error message to your customers */}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!stripe}
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}
