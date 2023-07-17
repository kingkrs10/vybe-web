"use client";
import { Fragment, useEffect, useId, useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";

import { AppScreen } from "@/components/AppScreen";
import { CircleBackground } from "@/components/CircleBackground";
import { Container } from "@/components/Container";
import { PhoneFrame } from "@/components/PhoneFrame";
import {
  DiageoLogo,
  LaravelLogo,
  MirageLogo,
  ReversableLogo,
  StatamicLogo,
  StaticKitLogo,
  TransistorLogo,
  TupleLogo,
} from "@/components/StockLogos";

const MotionAppScreenHeader = motion(AppScreen.Header);
const MotionAppScreenBody = motion(AppScreen.Body);

const features = [
  {
    name: "Create events and tickets",
    description:
      "Create events and tickets, with multiple ticket types, pricing, and availability options. You manage the ticket sales, we handle the rest.",
    icon: DeviceClockIcon,
    screen: CreateScreen,
  },
  {
    name: "Manage journey of your attendees",
    description:
      "Get a push notification every time we find out something that’s going to lower the share price on your holdings so you can sell before the information hits the public markets.",
    icon: DeviceUserIcon,
    screen: JourneyScreen,
  },
  {
    name: "Manage your sales and payouts",
    description:
      "We hide your stock purchases behind thousands of anonymous trading accounts, so suspicious activity can never be traced back to you.",
    icon: DeviceChartIcon,
    screen: SalesScreen,
  },
];

function DeviceUserIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#6B21A8" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
        fill="#6B21A8"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

function DeviceChartIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 13.838V26a2 2 0 01-2 2H11a2 2 0 01-2-2V15.65l2.57 3.212a1 1 0 001.38.175L15.4 17.2a1 1 0 011.494.353l1.841 3.681c.399.797 1.562.714 1.843-.13L23 13.837z"
        fill="#6B21A8"
      />
      <path
        d="M10 12h12"
        stroke="#737373"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <circle cx={16} cy={16} r={16} fill="#6B21A8" fillOpacity={0.2} />
    </svg>
  );
}

function DeviceNotificationIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#A3A3A3"
      />
      <path
        d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
        fill="#737373"
      />
    </svg>
  );
}

function DeviceClockIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#6B21A8" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v10h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h5v2H9a4 4 0 01-4-4V4z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 32a8 8 0 100-16 8 8 0 000 16zm1-8.414V19h-2v5.414l4 4L28.414 27 25 23.586z"
        fill="#6B21A8"
      />
    </svg>
  );
}

function DeviceTouchIcon(props) {
  let id = useId();

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          x1={14}
          y1={14.5}
          x2={7}
          y2={17}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="#D4D4D4" stopOpacity={0} />
        </linearGradient>
      </defs>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v13h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h4v2H9a4 4 0 01-4-4V4z"
        fill="#A3A3A3"
      />
      <path
        d="M7 22c0-4.694 3.5-8 8-8"
        stroke={`url(#${id}-gradient)`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 20l.217-5.513a1.431 1.431 0 00-2.85-.226L17.5 21.5l-1.51-1.51a2.107 2.107 0 00-2.98 0 .024.024 0 00-.005.024l3.083 9.25A4 4 0 0019.883 32H25a4 4 0 004-4v-5a3 3 0 00-3-3h-5z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

const headerAnimation = {
  initial: { opacity: 0, transition: { duration: 0.3 } },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const maxZIndex = 2147483647;

const bodyVariantBackwards = {
  opacity: 0.4,
  scale: 0.8,
  zIndex: 0,
  filter: "blur(4px)",
  zIndex: 0,
  transition: { duration: 0.4 },
};

const bodyVariantForwards = (custom) => ({
  y: "100%",
  zIndex: maxZIndex - custom.changeCount,
  transition: { duration: 0.4 },
});

const bodyAnimation = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: {
    initial: (custom) =>
      custom.isForwards ? bodyVariantForwards(custom) : bodyVariantBackwards,
    animate: (custom) => ({
      y: "0%",
      opacity: 1,
      scale: 1,
      zIndex: maxZIndex / 2 - custom.changeCount,
      filter: "blur(0px)",
      transition: { duration: 0.4 },
    }),
    exit: (custom) =>
      custom.isForwards ? bodyVariantBackwards : bodyVariantForwards(custom),
  },
};

function CreateScreen({ custom, animated = false }) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader {...(animated ? headerAnimation : {})}>
        <AppScreen.Title>Create events</AppScreen.Title>
        <AppScreen.Subtitle>
          Create <span className="text-white">live</span> and{" "}
          <span className="text-white">virtual</span> events.
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody {...(animated ? { ...bodyAnimation, custom } : {})}>
        <div className="mt-10 sm:mt-0">
          <div className="grid-cols-1">
            <div className="md:col-span-1">
              <div className="px-4 py-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Location
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Provide venue tips to enable everyone find your event
                </p>
              </div>
            </div>
            <div className="mt-0 md:col-span-2">
              <div className="overflow-hidden">
                <div className="bg-white px-4 py-2">
                  <div className="">
                    <div className="col-span-6">
                      <fieldset className="grid grid-cols-2 gap-4">
                        <legend className="sr-only">Delivery</legend>
                        <div className="">
                          <input
                            id="live"
                            className="peer hidden [&:checked_+_label_svg]:block"
                            type="radio"
                            checked
                            defaultValue="live"
                            onChange={() => {}}
                            readOnly
                            name="live"
                          />
                          <label
                            htmlFor="live"
                            className="block cursor-pointer rounded-lg border border-gray-100 p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-purple-500 peer-checked:ring-1 peer-checked:ring-purple-500"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-gray-700">Live event</p>
                              <svg
                                className="hidden h-5 w-5 text-purple-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          </label>
                        </div>
                        <div className="">
                          <input
                            id="virtual"
                            className="peer hidden [&:checked_+_label_svg]:block"
                            type="radio"
                            name="virtual"
                            defaultValue="virtual"
                            checked={false}
                            onChange={() => {}}
                            readOnly
                          />
                          <label
                            htmlFor="virtual"
                            className="block cursor-pointer rounded-lg border border-gray-100 p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-purple-500 peer-checked:ring-1 peer-checked:ring-purple-500"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-gray-700">Virtual event</p>
                              <svg
                                className="hidden h-5 w-5 text-purple-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          </label>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-3">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>
        <div className="mt-10 sm:mt-0">
          <div className="">
            <div className="md:col-span-1">
              <div className="px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Date and Time
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Let your guests know when your event starts and ends.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <fieldset>
                    <div className="mt-0 space-y-4">
                      <div className="col-span-6">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Timezone
                        </label>
                        <select
                          id="timezone"
                          name="timezone"
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                        >
                          <option value="">Select timezone</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="start-date"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Start date
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                ></path>
                              </svg>
                            </span>
                            <span
                              role="alert"
                              aria-live="polite"
                              className="react-datepicker__aria-live"
                            ></span>
                            <input
                              id="startDate"
                              placeholder="Select start date"
                              className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="end-date"
                            className="block text-sm font-medium text-gray-700"
                          >
                            End date
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                ></path>
                              </svg>
                            </span>

                            <span
                              role="alert"
                              aria-live="polite"
                              className="react-datepicker__aria-live"
                            ></span>
                            <input
                              id="endDate"
                              placeholder="Select end date"
                              className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function JourneyScreen({ custom, animated = false }) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader {...(animated ? headerAnimation : {})}>
        <AppScreen.Title>Scan tickets</AppScreen.Title>
        <AppScreen.Subtitle>
          Use <span className="text-white">QR codes</span> to make entry easy.
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody {...(animated ? { ...bodyAnimation, custom } : {})}>
        <div className="px-4 py-4">
          <div className="">
            <article className="mb-4">
              <div className="flex w-full items-end text-right">
                <button className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-800">
                  Scan Ticket
                </button>
              </div>
              <div>
                <dl className="mt-5 grid grid-cols-1 gap-5">
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-3 shadow">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Total guests
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      256
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
            <section className="w-full">
              <div className="-mx-4 mt-4 overflow-x-auto ring-1 ring-gray-100 sm:-mx-6 md:mx-0 md:rounded-lg">
                <table className="table-fixed divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500"
                      >
                        Guest name
                      </th>
                      <th
                        scope="col"
                        className=" hidden whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                      >
                        Checked In
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                      >
                        Order ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">
                          Prince D.
                        </div>
                      </td>
                      <td className="hidden px-3 py-3.5 text-right text-sm text-purple-900 lg:table-cell">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </td>
                      <td className="hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        64fc1bcd
                      </td>
                    </tr>
                    <tr>
                      <td className="relative border-t border-transparent py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">John B.</div>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-purple-900 lg:table-cell">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        98a2556f
                      </td>
                    </tr>
                    <tr>
                      <td className="relative border-t border-transparent py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">Tom F.</div>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-300 lg:table-cell">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        b999dcf0
                      </td>
                    </tr>
                    <tr>
                      <td className="relative border-t border-transparent py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">Sam P.</div>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-300 lg:table-cell">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        b48e65de
                      </td>
                    </tr>
                    <tr>
                      <td className="relative border-t border-transparent py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">Bob L.</div>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-300 lg:table-cell">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        b48e65de
                      </td>
                    </tr>
                    <tr>
                      <td className="relative border-t border-transparent py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">Kim K.</div>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-300 lg:table-cell">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        b48e65de
                      </td>
                    </tr>
                    <tr>
                      <td className="relative border-t border-transparent py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">
                          Prince B.
                        </div>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-300 lg:table-cell">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        b48e65de
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 z-20 flex items-end px-4 py-6 sm:items-start sm:p-6"
          >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end"></div>
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function SalesScreen({ custom, animated = false }) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader {...(animated ? headerAnimation : {})}>
        <AppScreen.Title>Monitor revenue</AppScreen.Title>
        <AppScreen.Subtitle>
          Keep a close eye on <span className="text-white">sales</span> and{" "}
          <span className="text-white">payouts</span>.
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody {...(animated ? { ...bodyAnimation, custom } : {})}>
        <div className="px-4">
          <div className="">
            <article className="mb-4">
              <div>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1">
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Total revenue
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-900">
                      $12,504.00
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Total orders
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-900">
                      420
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Tickets sold
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-900">
                      690
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
            <section className="">
              <div className="-mx-4 mt-4 overflow-auto ring-1 ring-gray-100 sm:-mx-6 md:mx-0 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-6"
                      >
                        Ticket name
                      </th>
                      <th
                        scope="col"
                        className="hidden whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="hidden whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="hidden whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                      >
                        Processing fee
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold text-gray-500"
                      >
                        Ticket revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">GA</div>
                      </td>
                      <td className="hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        4/200
                      </td>
                      <td className="hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        $60.00
                      </td>
                      <td className="hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        $6.00
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm text-gray-500">
                        $66.00
                      </td>
                    </tr>
                    <tr>
                      <td className="relative border-t border-transparent py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">VIP</div>
                        <div className="absolute right-0 left-6 -top-px h-px bg-gray-200"></div>
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        0/122
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        $120.00
                      </td>
                      <td className="hidden border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell">
                        $12.00
                      </td>
                      <td className="border-t border-gray-200 px-3 py-3.5 text-right text-sm text-gray-500">
                        $142.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function usePrevious(value) {
  let ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function FeaturesDesktop() {
  let [changeCount, setChangeCount] = useState(0);
  let [selectedIndex, setSelectedIndex] = useState(0);
  let prevIndex = usePrevious(selectedIndex);
  let isForwards = prevIndex === undefined ? true : selectedIndex > prevIndex;

  let onChange = useDebouncedCallback(
    (selectedIndex) => {
      setSelectedIndex(selectedIndex);
      setChangeCount((changeCount) => changeCount + 1);
    },
    100,
    { leading: true }
  );

  return (
    <Tab.Group
      as="div"
      className="grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24"
      selectedIndex={selectedIndex}
      onChange={onChange}
      vertical
    >
      <Tab.List className="relative z-10 order-last col-span-6 space-y-6">
        {features.map((feature, featureIndex) => (
          <div
            key={feature.name}
            className="relative rounded-2xl transition-colors hover:bg-gray-800/30"
          >
            {featureIndex === selectedIndex && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-gray-800"
                initial={{ borderRadius: 16 }}
              />
            )}
            <div className="relative z-10 p-8">
              <feature.icon className="h-8 w-8" />
              <h3 className="mt-6 text-lg font-semibold text-white">
                <Tab className="text-left outline-none [&:not(:focus-visible)]:focus:outline-none">
                  <span className="absolute inset-0 rounded-2xl" />
                  {feature.name}
                </Tab>
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </Tab.List>
      <div className="relative col-span-6">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <CircleBackground color="#6B21A8" className="animate-spin" />
        </div>
        <PhoneFrame className="z-10 mx-auto w-full max-w-[366px]">
          <Tab.Panels as={Fragment}>
            <AnimatePresence
              initial={false}
              custom={{ isForwards, changeCount }}
            >
              {features.map((feature, featureIndex) =>
                selectedIndex === featureIndex ? (
                  <Tab.Panel
                    static
                    key={feature.name + changeCount}
                    className="col-start-1 row-start-1 flex focus:outline-offset-[32px] [&:not(:focus-visible)]:focus:outline-none"
                  >
                    <feature.screen
                      animated
                      custom={{ isForwards, changeCount }}
                    />
                  </Tab.Panel>
                ) : null
              )}
            </AnimatePresence>
          </Tab.Panels>
        </PhoneFrame>
      </div>
    </Tab.Group>
  );
}

function FeaturesMobile() {
  let [activeIndex, setActiveIndex] = useState(0);
  let slideContainerRef = useRef();
  let slideRefs = useRef([]);

  useEffect(() => {
    let observer = new window.IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(slideRefs.current.indexOf(entry.target));
            break;
          }
        }
      },
      {
        root: slideContainerRef.current,
        threshold: 0.6,
      }
    );

    for (let slide of slideRefs.current) {
      if (slide) {
        observer.observe(slide);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [slideContainerRef, slideRefs]);

  return (
    <>
      <div
        ref={slideContainerRef}
        className="-mb-4 flex snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&::-webkit-scrollbar]:hidden"
      >
        {features.map((feature, featureIndex) => (
          <div
            key={featureIndex}
            ref={(ref) => (slideRefs.current[featureIndex] = ref)}
            className="w-full flex-none snap-center px-4 sm:px-6"
          >
            <div className="relative transform overflow-hidden rounded-2xl bg-gray-800 px-5 py-6">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <CircleBackground
                  color="#6B21A8"
                  className={featureIndex % 2 === 1 ? "rotate-180" : undefined}
                />
              </div>
              <PhoneFrame className="relative mx-auto w-full max-w-[366px]">
                <feature.screen />
              </PhoneFrame>
              <div className="absolute inset-x-0 bottom-0 bg-gray-800/95 p-6 backdrop-blur sm:p-10">
                <feature.icon className="h-8 w-8" />
                <h3 className="mt-6 text-sm font-semibold text-white sm:text-lg">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {features.map((_, featureIndex) => (
          <button
            type="button"
            key={featureIndex}
            className={clsx(
              "relative h-0.5 w-4 rounded-full",
              featureIndex === activeIndex ? "bg-gray-300" : "bg-gray-500"
            )}
            aria-label={`Go to slide ${featureIndex + 1}`}
            onClick={() => {
              slideRefs.current[featureIndex].scrollIntoView({
                block: "nearest",
                inline: "nearest",
              });
            }}
          >
            <span className="absolute -inset-x-1.5 -inset-y-3" />
          </button>
        ))}
      </div>
    </>
  );
}

export function PrimaryFeatures() {
  return (
    <section
      id="features"
      aria-label="Features for investing all your money"
      className="bg-gray-900 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
          <h2 className="text-3xl font-medium tracking-tight text-white">
            Every feature you need to win. Try it for yourself.
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            Our comprehensive suite of services includes event planning,
            promotion, execution, and post-event content to ensure every aspect
            of your event is executed to perfection.
          </p>
        </div>
      </Container>
      <div className="mt-16 md:hidden">
        <FeaturesMobile />
      </div>
      <Container className="hidden md:mt-20 md:block">
        <FeaturesDesktop />
      </Container>
    </section>
  );
}
