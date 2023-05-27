"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { guestsAtom } from "@/lib/atoms";

export default function GuestFields({ item }: { item: any }) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [index, setIndex] = useState();
  const [guests, setGuests] = useAtom(guestsAtom);

  useEffect(() => {
    if (index != undefined) {
      const data = {
        id: item.ticket + "/" + index,
        ticketId: item.ticket,
        eventId: item.event,
        number: index,
        name: name,
        email: email,
        type: item.name,
        price: item.price,
        startDate: item.startDate,
        endDate: item.endDate,
      };
      const clean = (prev: any) => {
        let cleared = prev.filter(function (item: any) {
          return item.id != data.id;
        });
        return [...cleared, data];
      };
      setGuests(clean(guests));
    }
  }, [
    email,
    name,
    index,
    guests,
    item,
    setGuests,
    item.ticket,
    item.event,
    item.name,
    item.price,
    item.startDate,
    item.endDate,
  ]);

  const fields = (item: any, index: any) => {
    if (item.target.name === "fullname") {
      setName(item.target.value);
      setIndex(index);
    } else if (item.target.name === "email") {
      setEmail(item.target.value);
      setIndex(index);
    }
  };

  return (
    <div>
      <h3 className="pt-6 text-lg">{item.name}</h3>
      {Array.from(Array(+item.quantity).keys()).map((i: any, index: number) => {
        return (
          <div className="relative mb-4" key={item.ticket + "/" + index}>
            <div className="absolute rounded-b-md bg-gray-200 px-2">
              {index + 1}
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="full-name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Full name
              </label>
              <div className="mt-0 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  onChange={(e) => {
                    fields(e, index + 1);
                  }}
                  autoComplete="given-name"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2 ">
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
                  onChange={(e) => {
                    fields(e, index + 1);
                  }}
                  autoComplete="email"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
