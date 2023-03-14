"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {} from "@stripe/react-stripe-js";
import PaymentForm from "./payment-form";
import { useAtom } from "jotai";
import { totalAtom, clientSecretAtom } from "@/lib/atoms";
import ApiClient from "@/lib/axios";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const stripePromise = loadStripe(
  "pk_test_51MTFXaCUhdRlkvtYAVc1UXSJTKSKKZwQtu0ni1YvwsqnDo6hHeViCablciODf4QGRj3r5Hp5wt7Eg46sS0elwpte00ilVEB2zm"
);

export default function PaymentDetails({
  id,
  session,
}: {
  id: any;
  session: any;
}) {
  // const [clientSecret, setClientSecret] = useState("");
  const [total, setTotal] = useAtom(totalAtom);
  const [clientSecret, setClientSecret] = useAtom(clientSecretAtom);
  // console.log(total);
  // const [total, setTotal] = useState<any>([]);
  // console.log(session.userData, total.total);
  async function paymentIntent() {
    try {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      console.log(user.data);
      const intent = await ApiClient(user?.token).get(
        `/stripe/paymentIntent?customer=${
          user?.data?.stripeCustomerId
        }&amount=${total.total * 100}&currency=usd`
      );
      // console.log(intent.data.data);
      setClientSecret(intent.data.data.client_secret);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (clientSecret === "") {
      paymentIntent();
    }
  });

  const options = {
    // passing the client secret obtained in step 3
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#9333ea",
        colorBackground: "#ffffff",
        colorText: "#000000",
        // See all possible variables below
      },
    },
  };

  return (
    <section
      aria-labelledby="payment-heading"
      className="lg:col-span-1 lg:col-start-3 "
    >
      {clientSecret && (
        <div className="mx-auto bg-white p-6 shadow sm:rounded-lg">
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm id={id} session={session} />
          </Elements>
        </div>
      )}
    </section>
  );
}
