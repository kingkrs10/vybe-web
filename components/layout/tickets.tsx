"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useAtom } from "jotai";
import { ticketsAtom } from "@/lib/atoms";

import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import { redirect } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";

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
  const [total, setTotal] = useState<any>([]);
  const [count, setCount] = useAtom(ticketsAtom);

  const router = useRouter();
  const pathname = usePathname();

  // console.log(session);

  useEffect(() => {
    async function getData(eventId: any) {
      try {
        const tickets = await axios.get(
          `${
            process.env.NEXT_PUBLIC_APIURL
          }/tickets/all?eventId=${eventId}&pageNo=${1}`
        );

        setTickets(tickets.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getData(id);
  }, []);

  useEffect(() => {
    const initialValue = 0;
    let subtotal = count
      .filter((item: any) => {
        return item.event === id;
      })
      .reduce((accumulator, currentValue) => {
        return (
          accumulator +
          parseFloat(currentValue.details.cost) * currentValue.details.count
        );
      }, initialValue);

    let fee = subtotal * 0.07;
    let total = subtotal + fee;
    setTotal({
      total: formatter.format(total.toFixed(2)),
      subtotal: formatter.format(subtotal.toFixed(2)),
      fee: formatter.format(+fee.toFixed(2)),
    });
  }, [count]);

  const getDefault = (ticket: any) => {
    let defaultValue = count.filter((i: any) => {
      return i.details.ticket === ticket;
    });
    return defaultValue[0] ? defaultValue[0].details.count : 0;
  };

  return (
    <section
      aria-labelledby="timeline-title"
      className="lg:col-span-1 lg:col-start-3"
    >
      <div className="bg-white shadow sm:rounded-lg ">
        <h2
          id="timeline-title"
          className="text-lg font-medium px-4 py-4 sm:px-6 text-gray-900 border-b w-full"
        >
          Tickets
        </h2>

        <div className="mt-6 flow-root px-4 py-0 sm:px-6">
          <ul role="list" className="">
            {tickets.map((item: any, itemIdx: any) => (
              <li key={itemIdx}>
                <div className="flex mb-4">
                  <div className="mr-4 flex-shrink-0 mb-0">
                    <p className="text-lg">{item.name}</p>
                    {statusDetail(item.startDate, item.endDate)}
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <div className="text-right justify-items-end grow">
                    <p>${item.price}</p>
                    <select
                      id="count"
                      name="count"
                      className="mt-1 w-16 self-end justify-self-end rounded-md border-gray-300 py-1 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      defaultValue={getDefault(item.ticketId)}
                      onChange={(e) => {
                        const data = {
                          event: item.eventId,
                          details: {
                            ticket: item.ticketId,
                            count: e.target.value,
                            cost: item.price,
                          },
                        };
                        const clean = (prev: any) => {
                          // console.log(prev);
                          let cleared = prev.filter(function (item: any) {
                            return item.details.ticket !== data.details.ticket;
                          });
                          return [...cleared, data];
                        };
                        // setCount()
                        setCount((prev: any) => (prev ? clean(prev) : [data]));

                        // clean()
                      }}
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i, n) => (
                        <option key={n} value={i}>
                          {i}
                        </option>
                      ))}
                      {/* <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option> */}
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className=" flow-root">
          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className=" bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-6"
          >
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {total.subtotal ? total.subtotal : 0}
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
                  {total.fee ? total.fee : 0}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {total.total ? total.total : 0}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="justify-stretch px-4 py-4 sm:px-4 flex flex-col">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (session === undefined) {
                router.push(`/login?redirect=${pathname}`);
              }
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {session !== undefined
              ? "Purchase a ticket"
              : "Login to purchase a ticket"}
          </button>
        </div>
      </div>
    </section>
  );
}
