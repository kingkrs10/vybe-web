"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import {
  CheckIcon,
  HandThumbUpIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

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

export default function Tickets({ id }: { id: any }) {
  const [tickets, setTickets] = useState<any>([]);

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
                      id="location"
                      name="location"
                      className="mt-1 w-16 self-end justify-self-end rounded-md border-gray-300 py-1 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      defaultValue="0"
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="justify-stretch px-4 py-4 sm:px-4 flex flex-col">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Purchase a ticket
          </button>
        </div>
      </div>
    </section>
  );
}
