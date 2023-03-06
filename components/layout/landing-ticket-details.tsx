"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import moment from "moment";
import Map from "@/components/layout/map";
import ApiClient from "@/lib/axios";
import axios from "axios";

export default function TicketsDetails({
  id,
  session,
}: {
  id: any;
  session: any;
}) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        // const session = await fetch(`/api/session`);
        // let user = await session.json();
        const event = await ApiClient(null).get(`/events/${id}`);
        setData(event.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);

  return (
    <section aria-labelledby="applicant-information-title">
      <div className="bg-white shadow sm:rounded-lg">
        {data.image && (
          <Image
            alt="Party"
            src={data.image ? data.image : "/login.jpeg"}
            width={500}
            priority
            height={500}
            className="h-96 w-full rounded-t-lg object-cover"
          />
        )}

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
                {moment(data.startDate).format("MMMM, Do YYYY — h:mm A")}
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
