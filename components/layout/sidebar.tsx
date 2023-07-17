"use client";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3BottomLeftIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import { menuAtom } from "@/lib/atoms";
import Logo from "./logo";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: InboxIcon, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useAtom(menuAtom);

  const pathname = usePathname();
  // const uuid = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  let eventId;
  if (pathname?.includes(`/dashboard/events/overview/`)) {
    eventId = pathname.split(`/dashboard/events/overview/`)[1];
  } else if (pathname?.includes(`/dashboard/events/information/`)) {
    eventId = pathname.split(`/dashboard/events/information/`)[1];
  } else if (pathname?.includes(`/dashboard/events/tickets/`)) {
    eventId = pathname.split(`/dashboard/events/tickets/`)[1];
  } else if (pathname?.includes(`/dashboard/events/sales/`)) {
    eventId = pathname.split(`/dashboard/events/sales/`)[1];
  } else if (pathname?.includes(`/dashboard/events/guestlist/`)) {
    eventId = pathname.split(`/dashboard/events/guestlist/`)[1];
  } else if (pathname?.includes(`/dashboard/events/payments/`)) {
    eventId = pathname.split(`/dashboard/events/payments/`)[1];
  }
  // console.log(eventId);
  // const eventId = searchParams.get("eventId");
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
                    <button
                      // type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <Logo />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  {/* <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group rounded-md py-2 px-2 flex items-center text-base font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav> */}
                  {(pathname === "/dashboard" ||
                    pathname === "/dashboard/events" ||
                    pathname === "/dashboard/profile") && (
                    <nav aria-label="Main Nav" className="space-y-1 px-2 pb-4">
                      <Link
                        href={`/dashboard/events`}
                        passHref
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/events`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
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
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          My events
                        </span>
                      </Link>

                      {/* <Link
                        href={`/dashboard/profile`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/profile`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
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
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Profile
                        </span>
                      </Link> */}
                    </nav>
                  )}
                  {pathname?.includes(`/dashboard/events/`) &&
                    (pathname === `/dashboard/events/new` ? (
                      <>
                        <nav
                          aria-label="Main Nav"
                          className="space-y-1 px-2 pb-4"
                        >
                          <Link
                            href={`/dashboard/events`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 `}
                          >
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
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Back to events
                            </span>
                          </Link>
                        </nav>
                      </>
                    ) : (
                      <>
                        <nav aria-label="Main Nav" className="px-2">
                          <Link
                            href={`/dashboard/events`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                              pathname === `/dashboard/events`
                                ? ` bg-gray-100 text-black`
                                : ` text-gray-700`
                            }`}
                          >
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
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Back to events
                            </span>
                          </Link>
                        </nav>
                        <nav
                          aria-label="Main Nav"
                          className="space-y-1 px-2 pb-4"
                        >
                          <Link
                            href={`/dashboard/events/overview/${eventId}`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                              pathname ===
                              `/dashboard/events/overview/${eventId}`
                                ? ` bg-gray-100 text-black`
                                : ` text-gray-700`
                            }`}
                          >
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
                                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Overview
                            </span>
                          </Link>

                          <Link
                            href={`/dashboard/events/information/${eventId}`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                              pathname ===
                              `/dashboard/events/information/${eventId}`
                                ? ` bg-gray-100 text-black`
                                : ` text-gray-700`
                            }`}
                          >
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
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Information
                            </span>
                          </Link>

                          <Link
                            href={`/dashboard/events/tickets/${eventId}`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                              pathname ===
                              `/dashboard/events/tickets/${eventId}`
                                ? ` bg-gray-100 text-black`
                                : ` text-gray-700`
                            }`}
                          >
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
                                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Tickets
                            </span>
                          </Link>
                        </nav>
                        <nav
                          aria-label="Main Nav"
                          className="space-y-1 px-2 pb-4"
                        >
                          <Link
                            href={`/dashboard/events/sales/${eventId}`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                              pathname === `/dashboard/events/sales/${eventId}`
                                ? ` bg-gray-100 text-black`
                                : ` text-gray-700`
                            }`}
                          >
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
                                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Sales
                            </span>
                          </Link>

                          <Link
                            href={`/dashboard/events/guestlist/${eventId}`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                              pathname ===
                              `/dashboard/events/guestlist/${eventId}`
                                ? ` bg-gray-100 text-black`
                                : ` text-gray-700`
                            }`}
                          >
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
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Guestlist
                            </span>
                          </Link>

                          <Link
                            href={`/dashboard/events/payments/${eventId}`}
                            passHref
                            className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                              pathname ===
                              `/dashboard/events/payments/${eventId}`
                                ? ` bg-gray-100 text-black`
                                : ` text-gray-700`
                            }`}
                          >
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
                                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                              />
                            </svg>

                            <span className="ml-3 text-sm font-medium">
                              Payments
                            </span>
                          </Link>
                        </nav>
                      </>
                    ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="z-20 flex flex-shrink-0 items-center px-4">
            <Logo />
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            {/* <nav className="space-y-1 px-2 pb-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </nav> */}
            {(pathname === "/dashboard" ||
              pathname === "/dashboard/events" ||
              pathname === "/dashboard/profile") && (
              <nav aria-label="Main Nav" className="space-y-1 px-2 pb-4">
                <Link
                  href={`/dashboard/events`}
                  passHref
                  className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                    pathname === `/dashboard/events`
                      ? ` bg-gray-100 text-black`
                      : ` text-gray-700`
                  }`}
                >
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>

                  <span className="ml-3 text-sm font-medium">My events</span>
                </Link>

                {/* <Link
                  href={`/dashboard/profile`}
                  className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                    pathname === `/dashboard/profile`
                      ? ` bg-gray-100 text-black`
                      : ` text-gray-700`
                  }`}
                >
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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>

                  <span className="ml-3 text-sm font-medium">Profile</span>
                </Link> */}
              </nav>
            )}
            {pathname?.includes(`/dashboard/events/`) &&
              (pathname === `/dashboard/events/new` ? (
                <>
                  <nav aria-label="Main Nav" className="space-y-1 px-2 pb-4">
                    <Link
                      href={`/dashboard/events`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 `}
                    >
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
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">
                        Back to events
                      </span>
                    </Link>
                  </nav>
                </>
              ) : (
                <>
                  <nav aria-label="Main Nav" className="space-y-1 px-2 pb-4">
                    <Link
                      href={`/dashboard/events`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                        pathname === `/dashboard/events`
                          ? ` bg-gray-100 text-black`
                          : ` text-gray-700`
                      }`}
                    >
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
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">
                        Back to events
                      </span>
                    </Link>
                  </nav>
                  <nav aria-label="Main Nav" className="space-y-1 px-2 pb-4">
                    <Link
                      href={`/dashboard/events/overview/${eventId}`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                        pathname === `/dashboard/events/overview/${eventId}`
                          ? ` bg-gray-100 text-black`
                          : ` text-gray-700`
                      }`}
                    >
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
                          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">Overview</span>
                    </Link>

                    <Link
                      href={`/dashboard/events/information/${eventId}`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                        pathname === `/dashboard/events/information/${eventId}`
                          ? ` bg-gray-100 text-black`
                          : ` text-gray-700`
                      }`}
                    >
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
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">
                        Information
                      </span>
                    </Link>

                    <Link
                      href={`/dashboard/events/tickets/${eventId}`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                        pathname === `/dashboard/events/tickets/${eventId}`
                          ? ` bg-gray-100 text-black`
                          : ` text-gray-700`
                      }`}
                    >
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
                          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">Tickets</span>
                    </Link>
                  </nav>
                  <nav aria-label="Main Nav" className="space-y-1 px-2 pb-4">
                    <Link
                      href={`/dashboard/events/sales/${eventId}`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                        pathname === `/dashboard/events/sales/${eventId}`
                          ? ` bg-gray-100 text-black`
                          : ` text-gray-700`
                      }`}
                    >
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
                          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">Sales</span>
                    </Link>

                    <Link
                      href={`/dashboard/events/guestlist/${eventId}`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                        pathname === `/dashboard/events/guestlist/${eventId}`
                          ? ` bg-gray-100 text-black`
                          : ` text-gray-700`
                      }`}
                    >
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
                          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">
                        Guestlist
                      </span>
                    </Link>

                    <Link
                      href={`/dashboard/events/payments/${eventId}`}
                      passHref
                      className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                        pathname === `/dashboard/events/payments/${eventId}`
                          ? ` bg-gray-100 text-black`
                          : ` text-gray-700`
                      }`}
                    >
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
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                      </svg>

                      <span className="ml-3 text-sm font-medium">Payments</span>
                    </Link>
                  </nav>
                </>
              ))}
          </div>
        </div>
      </div>

      {/* <aside className="w-full sm:w-1/3 md:w-1/4 ">
        <div className="sticky top-0 w-full">
          <div className="flex h-screen flex-col justify-between border-r bg-white">
            <div className="px-4 py-6">
              <div className="flex h-10 w-32 rounded-lg p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 pr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                  />
                </svg>
                <div className="pl-2">tickets</div>
              </div>

              {(pathname === "/dashboard" ||
                pathname === "/dashboard/events" ||
                pathname === "/dashboard/profile") && (
                <nav
                  aria-label="Main Nav"
                  className="mt-6 flex flex-col space-y-1"
                >
                  
                  <Link
                    href={`/dashboard/events`}
                    className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                      pathname === `/dashboard/events`
                        ? ` bg-gray-100 text-black`
                        : ` text-gray-700`
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>

                    <span className="ml-3 text-sm font-medium">My events</span>
                  </Link>

                  <Link
                    href={`/dashboard/profile`}
                    className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                      pathname === `/dashboard/profile`
                        ? ` bg-gray-100 text-black`
                        : ` text-gray-700`
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>

                    <span className="ml-3 text-sm font-medium">Profile</span>
                  </Link>
                </nav>
              )}
              {pathname?.includes(`/dashboard/events/`) &&
                (pathname === `/dashboard/events/new` ? (
                  <>
                    <nav
                      aria-label="Main Nav"
                      className="mt-6 flex flex-col space-y-1"
                    >
                      <Link
                        href={`/dashboard/events`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Back to events
                        </span>
                      </Link>
                    </nav>
                  </>
                ) : (
                  <>
                    <nav
                      aria-label="Main Nav"
                      className="mt-6 flex flex-col space-y-1"
                    >
                      <Link
                        href={`/dashboard/events`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/events`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Back to events
                        </span>
                      </Link>
                    </nav>
                    <nav
                      aria-label="Main Nav"
                      className="mt-6 flex flex-col space-y-1"
                    >
                      <Link
                        href={`/dashboard/events/overview/${eventId}`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/events/overview/${eventId}`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Overview
                        </span>
                      </Link>

                      <Link
                        href={`/dashboard/events/information/${eventId}`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname ===
                          `/dashboard/events/information/${eventId}`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Information
                        </span>
                      </Link>

                      <Link
                        href={`/dashboard/events/tickets/${eventId}`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/events/tickets/${eventId}`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Tickets
                        </span>
                      </Link>
                    </nav>
                    <nav
                      aria-label="Main Nav"
                      className="mt-6 flex flex-col space-y-1"
                    >
                      <Link
                        href={`/dashboard/events/sales/${eventId}`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/events/sales/${eventId}`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">Sales</span>
                      </Link>

                      <Link
                        href={`/dashboard/events/guestlist/${eventId}`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/events/guestlist/${eventId}`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Guestlist
                        </span>
                      </Link>

                      <Link
                        href={`/dashboard/events/payments/${eventId}`}
                        className={`flex items-center rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700 ${
                          pathname === `/dashboard/events/payments/${eventId}`
                            ? ` bg-gray-100 text-black`
                            : ` text-gray-700`
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                          />
                        </svg>

                        <span className="ml-3 text-sm font-medium">
                          Payments
                        </span>
                      </Link>
                    </nav>
                  </>
                ))}
            </div>
          </div>
        </div>
      </aside> */}
    </>
  );
}
