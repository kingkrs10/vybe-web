"use client";
import Image from "next/image";
import axios from "axios";
import moment from "moment";
import LandingNav from "../../../components/header/landing-header";
import LandingFooter from "../../../components/footer/landing-footer";
import { Fragment, useEffect, useState, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
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

const user = {
  name: "Whitney Francis",
  email: "whitney@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
};

const navigation = [
  { name: "Dashboard", href: "#" },
  { name: "Jobs", href: "#" },
  { name: "Applicants", href: "#" },
  { name: "Company", href: "#" },
];

const breadcrumbs = [
  { name: "Jobs", href: "#", current: false },
  { name: "Front End Developer", href: "#", current: false },
  { name: "Applicants", href: "#", current: true },
];

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const attachments = [
  { name: "resume_front_end_developer.pdf", href: "#" },
  { name: "coverletter_front_end_developer.pdf", href: "#" },
];

const eventTypes = {
  applied: { icon: UserIcon, bgColorClass: "bg-gray-400" },
  advanced: { icon: HandThumbUpIcon, bgColorClass: "bg-blue-500" },
  completed: { icon: CheckIcon, bgColorClass: "bg-green-500" },
};

const timeline = [
  {
    id: 1,
    type: eventTypes.applied,
    content: "Applied to",
    target: "Front End Developer",
    date: "Sep 20",
    datetime: "2020-09-20",
  },
  {
    id: 2,
    type: eventTypes.advanced,
    content: "Advanced to phone screening by",
    target: "Bethany Blake",
    date: "Sep 22",
    datetime: "2020-09-22",
  },
  {
    id: 3,
    type: eventTypes.completed,
    content: "Completed phone screening with",
    target: "Martha Gardner",
    date: "Sep 28",
    datetime: "2020-09-28",
  },
  {
    id: 4,
    type: eventTypes.advanced,
    content: "Advanced to interview by",
    target: "Bethany Blake",
    date: "Sep 30",
    datetime: "2020-09-30",
  },
  {
    id: 5,
    type: eventTypes.completed,
    content: "Completed interview with",
    target: "Katherine Snyder",
    date: "Oct 4",
    datetime: "2020-10-04",
  },
];
const comments = [
  {
    id: 1,
    name: "Leslie Alexander",
    date: "4d ago",
    imageId: "1494790108377-be9c29b29330",
    body: "Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.",
  },
  {
    id: 2,
    name: "Michael Foster",
    date: "4d ago",
    imageId: "1519244703995-f4e0f30006d5",
    body: "Et ut autem. Voluptatem eum dolores sint necessitatibus quos. Quis eum qui dolorem accusantium voluptas voluptatem ipsum. Quo facere iusto quia accusamus veniam id explicabo et aut.",
  },
  {
    id: 3,
    name: "Dries Vincent",
    date: "4d ago",
    imageId: "1506794778202-cad84cf45f1d",
    body: "Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function statusDetail(startDate: any, endDate: any) {
  const date = Date.now();
  const today = new Date(date).toISOString();
  // console.log(startDate, endDate, today);
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

const defaultProps = {
  center: {
    lat: 34.026884,
    lng: -6.848299,
  },
  zoom: 18,
};

function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // const [map, setMap] = useState<google.maps.Map>();

  // React.useEffect(() => {
  //   if (ref.current && !map) {
  //     setMap(new window.google.maps.Map(ref.current, {}));
  //   }
  // }, [ref, map]);
  useEffect(() => {
    if (ref.current) {
      // setMap(new window.google.maps.Map(ref.current, {defaultProps.center, defaultProps.zoom}));
      new window.google.maps.Map(ref.current, {
        center,
        zoom,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false,
        panControl: false,
        streetViewControl: false,
      });
    }
  }, [ref]);

  return <div ref={ref} id="map" style={{ flexGrow: "1", height: "100%" }} />;
}

export default function EventPage({ params }: { params: any }) {
  const [data, setData] = useState<any>([]);
  const [tickets, setTickets] = useState<any>([]);

  useEffect(() => {
    async function getData(eventId: any) {
      try {
        const event = await axios.get(
          `${process.env.NEXT_PUBLIC_APIURL}/events/${eventId}`
        );
        const tickets = await axios.get(
          `${
            process.env.NEXT_PUBLIC_APIURL
          }/tickets/all?eventId=${eventId}&pageNo=${1}`
        );

        setData(event.data.data);
        setTickets(tickets.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getData(params.id);
  }, []);

  // const data = await getData(params.id);
  // console.log(JSON.stringify(data));
  return (
    <div className="">
      <LandingNav />
      {/* <div className="bg-white">
        <div className="mx-auto max-w-2xl py-6 px-8 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"></div>
          <section className="bg-white border-2 border-gray-100 rounded-lg mt-4">
            <div className="mx-auto max-w-screen-xl py-4 px-4">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:h-full">
                  <img
                    alt="Party"
                    src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="lg:py-24">
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    {data.name}
                  </h2>

                  <p className="mt-4 text-gray-600">{data.description}</p>
                  <p className="mt-4 text-gray-600">{data.address}</p>
                  <p className="text-gray-600">
                    {data.city}, {data.country}
                  </p>
                  <p className="mt-4 text-gray-600">
                    {moment(data.startDate).format("MMMM, Do YYYY")} &mdash;{" "}
                    {moment(data.startTime, "HH:mm:ss").format("h:mm A")}
                  </p>

                  <a
                    href="#"
                    className="mt-8 inline-flex items-center rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                  >
                    <span className="text-sm font-medium"> Get Started </span>

                    <svg
                      className="ml-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div> */}

      <div className="min-h-full pb-4 bg-gray-50">
        <main className="py-2">
          {/* Page header */}
          {/* <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                    alt=""
                  />
                  <span
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Ricardo Cooper
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Applied for{" "}
                  <a href="#" className="text-gray-900">
                    Front End Developer
                  </a>{" "}
                  on <time dateTime="2020-08-25">August 25, 2020</time>
                </p>
              </div>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Disqualify
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Advance to offer
              </button>
            </div>
          </div> */}

          <div className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              {/* Description list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <img
                    alt="Party"
                    src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    className="h-96 w-full object-cover rounded-t-lg"
                  />
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-2xl font-medium leading-6 text-gray-900"
                    >
                      {data.name}
                    </h2>
                    {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Personal details and application.
                    </p> */}
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
                          {data.address}, {data.city}, {data.state}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div
                    // style={{ display: "flex", height: "50vh" }}
                    className="mt-4 h-96"
                  >
                    <Wrapper
                      apiKey={"AIzaSyB0hYyI2S3b1bB--5Z-nRq2ZRcw1YXC-ag"}
                      // render={render}
                    >
                      <MyMapComponent
                        center={defaultProps.center}
                        zoom={defaultProps.zoom}
                      />
                    </Wrapper>
                  </div>
                  {/* <div>
                    <a
                      href="#"
                      className="block bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 sm:rounded-b-lg"
                    >
                      Read full application
                    </a>
                  </div> */}
                </div>
              </section>

              {/* Comments*/}
              {/* <section aria-labelledby="notes-title">
                <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h2
                        id="notes-title"
                        className="text-lg font-medium text-gray-900"
                      >
                        Notes
                      </h2>
                    </div>
                    <div className="px-4 py-6 sm:px-6">
                      <ul role="list" className="space-y-8">
                        {comments.map((comment) => (
                          <li key={comment.id}>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={`https://images.unsplash.com/photo-${comment.imageId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                  alt=""
                                />
                              </div>
                              <div>
                                <div className="text-sm">
                                  <a
                                    href="#"
                                    className="font-medium text-gray-900"
                                  >
                                    {comment.name}
                                  </a>
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                  <p>{comment.body}</p>
                                </div>
                                <div className="mt-2 space-x-2 text-sm">
                                  <span className="font-medium text-gray-500">
                                    {comment.date}
                                  </span>{" "}
                                  <span className="font-medium text-gray-500">
                                    &middot;
                                  </span>{" "}
                                  <button
                                    type="button"
                                    className="font-medium text-gray-900"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-6 sm:px-6">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <form action="#">
                          <div>
                            <label htmlFor="comment" className="sr-only">
                              About
                            </label>
                            <textarea
                              id="comment"
                              name="comment"
                              rows={3}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Add a note"
                              defaultValue={""}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <a
                              href="#"
                              className="group inline-flex items-start space-x-2 text-sm text-gray-500 hover:text-gray-900"
                            >
                              <QuestionMarkCircleIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              <span>Some HTML is okay.</span>
                            </a>
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}
            </div>

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

                {/* Activity Feed */}
                <div className="mt-6 flow-root px-4 py-0 sm:px-6">
                  <ul role="list" className="">
                    {tickets.map((item: any, itemIdx: any) => (
                      <li key={itemIdx}>
                        <div className="flex mb-4">
                          <div className="mr-4 flex-shrink-0 mb-0">
                            <p>{item.name}</p>
                            {statusDetail(item.startDate, item.endDate)}
                          </div>
                          <div className="text-right grow">
                            <p>{item.price}</p>
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
          </div>
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}
