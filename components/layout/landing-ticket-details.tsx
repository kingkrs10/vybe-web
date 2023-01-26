"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Map from "@/components/layout/map";

export default function TicketsDetails({ id }: { id: any }) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    async function getData() {
      try {
        const event = await axios.get(
          `${process.env.NEXT_PUBLIC_APIURL}/events/${id}`
        );

        setData(event.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [id]);

  //   useEffect(() => {
  //     const initialValue = 0;
  //     let subtotal = count
  //       .filter((item: any) => {
  //         return item.event === id;
  //       })
  //       .reduce((accumulator, currentValue) => {
  //         return (
  //           accumulator +
  //           parseFloat(currentValue.details.cost) * currentValue.details.count
  //         );
  //       }, initialValue);

  //     let fee = subtotal * 0.07;
  //     let total = subtotal + fee;
  //     setTotal({
  //       total: formatter.format(total.toFixed(2)),
  //       subtotal: formatter.format(subtotal.toFixed(2)),
  //       fee: formatter.format(+fee.toFixed(2)),
  //     });
  //   }, [count]);

  //   const data = await getData(id);
  return (
    <section aria-labelledby="applicant-information-title">
      <div className="bg-white shadow sm:rounded-lg">
        <Image
          alt="Party"
          src={data.image ? data.image : "/login.jpeg"}
          width={500}
          priority
          height={500}
          className="h-96 w-full object-cover rounded-t-lg"
        />
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="applicant-information-title"
            className="text-2xl font-medium leading-6 text-gray-900"
          >
            {data.name}
          </h2>
        </div>
        <div className="px-4 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.description}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Date and time
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {moment(data.startDate).format("MMMM, Do YYYY")} &mdash;{" "}
                {moment(data.startTime, "HH:mm:ss").format("h:mm A")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.address}</dd>
            </div>
          </dl>
        </div>
        <Map lat={data.lat} lng={data.lng} />
      </div>
    </section>
  );
}
