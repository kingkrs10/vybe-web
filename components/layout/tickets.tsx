"use client";
import { useEffect, useState } from "react";
import ApiClient from "@/lib/axios";
import moment from "moment";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
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
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const today = new Date(Date.now()).getTime();

const statusDetail = (startDate: any, endDate: any) => {
  // const date = ;
  const statStartDate = new Date(startDate).getTime();
  const statEndDate = new Date(endDate).getTime();
  console.log(statStartDate, statEndDate, today);
  if (statStartDate < today && statEndDate > today) {
    return (
      <p className="text-xs">
        Ends on {moment(statEndDate).format("MMMM, Do YYYY")}
      </p>
    );
  } else if (statStartDate > today) {
    return (
      <p className="text-xs">
        Scheduled for {moment(statStartDate).format("MMMM, Do YYYY")}
      </p>
    );
  } else if (statEndDate < today) {
    return (
      <p className="text-xs">
        Ended on {moment(statEndDate).format("MMMM, Do YYYY")}
      </p>
    );
  }
  // return null;
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function generateStaticParams() {
  const params = [{ totalAmount: 0, subtotal: 0, fee: 0 }];

  return params.map((param) => ({
    totalServer: param,
  }));
}

export default function Tickets({
  id,
  session,
}: // totalServer,
{
  id: any;
  session: any;
  // totalServer: { totalAmount: number; subtotal: number; fee: number };
}) {
  const [tickets, setTickets] = useState<any>([]);
  // const [total, setTotal] = useState<any>([]);
  // useHydrateAtoms([[totalAtom, totalServer]]);
  const [total, setTotal] = useAtom(totalAtom);
  const [count, setCount] = useAtom(ticketsAtom);
  const [step, setStep] = useAtom(checkoutStepAtom);
  const [isFilled] = useAtom(guestFilledAtom);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        // const session = await fetch(`/api/session`);
        // let user = await session.json();
        const tickets = await ApiClient(null).get(
          `/tickets/all?eventId=${id}&pageNo=${1}`
        );
        setTickets(tickets.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  });

  useEffect(() => {
    const initialValue = 0;
    let subtotal = count
      .filter((item: any) => {
        return item.event === id;
      })
      .reduce((accumulator, currentValue: any) => {
        let price: number =
          currentValue.price === "free" ? 0 : parseFloat(currentValue.price);

        return accumulator + price * currentValue.quantity;
      }, initialValue);

    let fee = subtotal * 0.07;
    let totalAmount = subtotal + fee;

    setTotal({
      totalAmount: +totalAmount.toFixed(2),
      subtotal: +subtotal.toFixed(2),
      fee: +fee.toFixed(2),
    });
    // console.log(total);
  }, [count, id, setTickets, setTotal]);

  const getDefault = (ticket: any) => {
    let defaultValue: any = count.filter((i: any) => {
      return i.ticket === ticket;
    });
    return defaultValue[0] ? defaultValue[0].quantity : 0;
  };

  const buttonStatus = (session: any, step: number, isFilled: boolean) => {
    // console.log(session, step, isFilled);
    if (session === undefined) {
      return ["Login to purchase now", true];
    } else if (session !== undefined && step == 1) {
      return ["Purchase now", true];
    } else if (session !== undefined && step == 2 && !isFilled) {
      return ["Please add guest(s)", false];
    } else if (session !== undefined && step == 2 && isFilled) {
      return ["Pay now", true];
    } else if (session !== undefined && step == 3) {
      return ["Confirm payment", false];
    }
  };

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
                <div className="mb-4 flex flex-col">
                  <div className="mb-0 flex-shrink-0">
                    <p className="text-lg">{item.name}</p>
                  </div>
                  <div className="flex grow justify-between justify-items-end text-right">
                    <div className="mr-2">
                      {statusDetail(item.startDate, item.endDate)}
                      <p className="truncate text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <div>
                      <span className="mr-3">
                        {item.type == "free" ? "Free" : `$${item.price}`}
                      </span>
                      <select
                        id="count"
                        name="count"
                        disabled={
                          step === 2 ||
                          step === 3 ||
                          new Date(item.endDate) <= new Date(Date.now())
                            ? true
                            : false
                        }
                        className="mt-1 w-16 self-end justify-self-end rounded-md border-gray-300 py-1 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={getDefault(item.ticketId)}
                        onChange={(e) => {
                          const data = {
                            event: item.eventId,
                            ticket: item.ticketId,
                            quantity: e.target.value,
                            price: parseFloat(item.price) || 0,
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
                          setCount((prev) => clean(prev));
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
                {total.subtotal
                  ? formatter.format(total.subtotal)
                  : formatter.format(0)}
                {/* {formatter.format(total.subtotal)} */}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex text-sm text-gray-600">
                <span>Service fee</span>
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
                {total.fee ? formatter.format(total.fee) : formatter.format(0)}
                {/* {formatter.format(total.fee||0)} */}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">
                {total.totalAmount
                  ? formatter.format(total.totalAmount)
                  : formatter.format(0)}
                {/* {formatter.format(total.totalAmount||0)} */}
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex flex-col justify-stretch px-4 py-4 sm:px-4">
          <button
            type="button"
            disabled={!buttonStatus(session, step, isFilled)![1]}
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
            {buttonStatus(session, step, isFilled)![0].toString()}
          </button>
        </div>
      </div>
    </section>
  );
}
