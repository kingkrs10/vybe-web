"use client";
import { useEffect, useState } from "react";
import ApiClient from "@/lib/axios";
import moment from "moment";
import { useAtom } from "jotai";
import {
  ticketsAtom,
  checkoutStepAtom,
  guestFilledAtom,
  totalAtom,
} from "@/lib/atoms";

import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import { redirect } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { getSession, useSession } from "next-auth/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function statusDetail(startDate: any, endDate: any) {
  const date = Date.now();
  const today = new Date(date).toISOString();
  if (startDate >= today && endDate <= today) {
    return (
      <>
        <p className="text-xs">
          Ends on {moment(endDate).format("MMMM, Do YYYY")}
        </p>
      </>
    );
  } else if (startDate > today) {
    return (
      <>
        <p className="text-xs">
          Scheduled for {moment(startDate).format("MMMM, Do YYYY")}
        </p>
      </>
    );
  } else if (endDate < today) {
    return (
      <>
        <p className="text-xs">
          Ended on {moment(endDate).format("MMMM, Do YYYY")}
        </p>
      </>
    );
  }
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default function Tickets({ id, session }: { id: any; session: any }) {
  const [tickets, setTickets] = useState<any>([]);
  // const [total, setTotal] = useState<any>([]);
  const [total, setTotal] = useAtom(totalAtom);
  const [count, setCount] = useAtom(ticketsAtom);
  const [step, setStep] = useAtom(checkoutStepAtom);
  const [isFilled] = useAtom(guestFilledAtom);

  const router = useRouter();
  const pathname = usePathname();
  // const { data: session } = useSession();

  useEffect(() => {
    async function getData() {
      try {
        const tickets = await ApiClient().get(
          `/tickets/all?eventId=${id}&pageNo=${1}`
        );
        setTickets(tickets.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [id]);

  useEffect(() => {
    const initialValue = 0;
    let subtotal = count
      .filter((item: any) => {
        return item.event === id;
      })
      .reduce((accumulator, currentValue) => {
        return (
          accumulator +
          parseFloat(currentValue.price) * parseInt(currentValue.quantity)
        );
      }, initialValue);

    let fee = subtotal * 0.07;
    let total = subtotal + fee;
    setTotal({
      total: total.toFixed(2),
      subtotal: subtotal.toFixed(2),
      fee: fee.toFixed(2),
    });
  }, [count, id]);

  const getDefault = (ticket: any) => {
    let defaultValue = count.filter((i: any) => {
      return i.ticket === ticket;
    });
    return defaultValue[0] ? defaultValue[0].quantity : 0;
  };

  function buttonStatus(session: any, step: number, isFilled: boolean) {
    // console.log(session, step, isFilled);
    if (session == undefined) {
      return ["Login to purchase now", true];
    } else if (session != undefined && step == 1) {
      return ["Purchase now", true];
    } else if (session != undefined && step == 2 && !isFilled) {
      return ["Please add guest(s)", false];
    } else if (session != undefined && step == 2 && isFilled) {
      return ["Pay now", true];
    } else if (session != undefined && step == 3) {
      return ["Confirm payment", false];
    } else if (session != undefined && step == 4) {
      return ["Thank You", false];
    }
  }

  return (
    <section
      aria-labelledby="timeline-title"
      className="relative lg:col-span-1 lg:col-start-3"
    >
      <div className="sticky top-6 bg-white  shadow sm:rounded-lg">
        <h2
          id="timeline-title"
          className="w-full border-b px-4 py-4 text-lg font-medium text-gray-900 sm:px-6"
        >
          Tickets
        </h2>

        <div className="mt-6 flow-root px-4 py-0 sm:px-6">
          <ul role="list" className="">
            {tickets.map((item: any, itemIdx: any) => (
              <li key={itemIdx}>
                <div className="mb-4 flex">
                  <div className="mr-4 mb-0 flex-shrink-0">
                    <p className="text-lg">{item.name}</p>
                    {statusDetail(item.startDate, item.endDate)}
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <div className="grow justify-items-end text-right">
                    {item.type == "free" ? <p>Free</p> : <p>${item.price}</p>}
                    <select
                      id="count"
                      name="count"
                      disabled={step === 2 || step === 3 ? true : false}
                      className="mt-1 w-16 self-end justify-self-end rounded-md border-gray-300 py-1 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      defaultValue={getDefault(item.ticketId)}
                      onChange={(e) => {
                        const data = {
                          event: item.eventId,
                          ticket: item.ticketId,
                          quantity: e.target.value,
                          price: parseFloat(item.price),
                          name: item.name,
                          type: item.type,
                          startDate: item.startDate,
                          endDate: item.endDate,
                          // startTime: item.startTime,
                          // endTime: item.endTime,
                        };
                        const clean = (prev: any) => {
                          let cleared = prev.filter(function (item: any) {
                            return item.ticket != data.ticket;
                          });
                          return [...cleared, data];
                        };
                        setCount((prev: any) => clean(prev));
                      }}
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i, n) => (
                        <option key={n} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className=" mt-4 bg-gray-50 p-4 px-4 py-4 sm:p-6 lg:col-span-5 lg:mt-4 lg:p-6"
        >
          <dl className="space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">
                {/* {total.subtotal
                  ? formatter.format(total.subtotal)
                  : formatter.format(0)} */}
                {formatter.format(total.subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex text-sm text-gray-600">
                <span>Service fee (7%)</span>
                <a
                  href="#"
                  className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">
                    Learn more about how tax is calculated
                  </span>
                  <QuestionMarkCircleIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </a>
              </dt>
              <dd className="text-sm font-medium text-gray-900">
                {/* {total.fee ? formatter.format(total.fee) : formatter.format(0)} */}
                {formatter.format(total.fee)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">
                {/* {total.total
                  ? formatter.format(total.total)
                  : formatter.format(0)} */}
                {formatter.format(total.total)}
              </dd>
            </div>
          </dl>
        </section>

        <div className="justify-stretch flex flex-col px-4 py-4 sm:px-4">
          <button
            type="button"
            disabled={!buttonStatus(session, step, isFilled)[1]}
            onClick={(e) => {
              e.preventDefault();
              if (session == undefined) {
                router.push(`/login?redirect=${pathname}`);
              } else {
                setStep(2);
              }
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {buttonStatus(session, step, isFilled)[0].toString()}
          </button>
        </div>
      </div>
    </section>
  );
}
