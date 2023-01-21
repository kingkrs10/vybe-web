import Image from "next/image";
import axios from "axios";
import moment from "moment";
import LandingNav from "../../../components/header/landing-header";
import LandingFooter from "../../../components/footer/landing-footer";
import Tickets from "../../../components/layout/tickets";
import Map from "../../../components/layout/map";

import {
  ArrowLongLeftIcon,
  CheckIcon,
  HandThumbUpIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  QuestionMarkCircleIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

async function getData(eventId: any) {
  try {
    const event = await axios.get(
      `${process.env.NEXT_PUBLIC_APIURL}/events/${eventId}`
    );

    return event.data.data;
  } catch (error) {
    console.log(error);
  }
}

export default async function EventPage({ params }: { params: any }) {
  const data = await getData(params.id);
  // console.log(JSON.stringify(data));
  return (
    <div className="">
      <LandingNav />
      <div className="min-h-full pb-4 bg-gray-50">
        <main className="py-2">
          <div className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <Image
                    alt="Party"
                    src={data.image ? data.image : "/login.jpeg"}
                    width={500}
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
                        <dt className="text-sm font-medium text-gray-500">
                          About
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {data.description}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Date and time
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {moment(data.startDate).format("MMMM, Do YYYY")}{" "}
                          &mdash;{" "}
                          {moment(data.startTime, "HH:mm:ss").format("h:mm A")}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Location
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {data.address}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Map lat={data.lat} lng={data.lng} />
                </div>
              </section>
            </div>
            <Tickets id={params.id} />
          </div>
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}
