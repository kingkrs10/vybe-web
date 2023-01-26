"use client";

// import { unstable_getServerSession } from "next-auth/next";
import { Fragment, useState, forwardRef, createRef } from "react";
import LoginBtn from "../buttons/login-button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
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
import { menuAtom } from "../../lib/atoms";
import Image from "next/image";
// import { useRouter } from "next/router";

// const Button = forwardRef((props, ref) => (
//   // <button ref={ref} className="FancyButton">
//   //   {props.children}
//   // </button>
//   <LoginBtn ref={ref} />
// ));

// // You can now get a ref directly to the DOM button:
// const ref = createRef();
// <Button ref={ref}>Click me!</Button>;

const userNavigation = [
  { name: "Your Profile", href: "/dashboard/profile" },
  { name: "Settings", href: "/dashboard/settings" },
  { name: "Signout", href: "" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function HeaderMenu() {
  const [sidebarOpen, setSidebarOpen] = useAtom(menuAtom);
  //   const session = await unstable_getServerSession();
  const { data: session } = useSession();
  // let router = useRouter();
  // let activeMenu: any;
  return (
    <>
      <div className="sticky top-0 z-20 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex flex-1 justify-between px-4 md:px-0">
          <div className="flex flex-1">
            <form className="flex w-full md:ml-0" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative w-full ml-4 text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>
          <div className="ml-4 flex items-center md:ml-4">
            <a
              href="/dashboard/events/new"
              className="inline-block mr-8 rounded-md border border-transparent bg-white py-2 px-4 text-base font-medium text-indigo-900 hover:bg-opacity-75"
            >
              Create an event
            </a>
            <button
              type="button"
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3 mr-4">
              <div>
                <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  {session?.user?.image && (
                    <Image
                      alt="Profile picture"
                      width={32}
                      height={32}
                      src={session?.user?.image!}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) =>
                    item.name === "Signout" ? (
                      <Menu.Item key={item.name}>
                        <a
                          className={
                            "block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          }
                          onClick={(e) => signOut()}
                        >
                          Sign out
                        </a>
                      </Menu.Item>
                    ) : (
                      <Menu.Item key={item.name}>
                        {({ active }: { active: any }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block py-2 px-4 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    )
                  )}
                  {/* <Menu.Item key={"signout"}>
                    
                  </Menu.Item> */}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      {/* <header aria-label="Page Header" className="bg-gray-100">
        <div className=" max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center sm:justify-between sm:gap-4">
            <div className="relative hidden sm:block">
              <label className="sr-only" htmlFor="search">
                {" "}
                Search{" "}
              </label>

              <input
                className="h-10 w-full rounded-lg border-none bg-white pl-4 pr-10 text-sm shadow-sm sm:w-56"
                id="search"
                type="search"
                placeholder="Search website..."
              />

              <button
                type="button"
                className="absolute top-1/2 right-1 -translate-y-1/2 rounded-md bg-gray-50 p-2 text-gray-600 transition hover:text-gray-700"
              >
                <span className="sr-only">Submit Search</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 items-center justify-between gap-8 sm:justify-end">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="block shrink-0 rounded-lg bg-white p-2.5 text-gray-600 shadow-sm hover:text-gray-700 sm:hidden"
                >
                  <span className="sr-only">Search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* <a
                  href="#"
                  className="block shrink-0 rounded-lg bg-white p-2.5 text-gray-600 shadow-sm hover:text-gray-700"
                >
                  <span className="sr-only">Academy</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                </a> 

                <a
                  href="#"
                  className="block shrink-0 rounded-lg bg-white p-2.5 text-gray-600 shadow-sm hover:text-gray-700"
                >
                  <span className="sr-only">Notifications</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </a>
                <span className="inline-flex divide-x overflow-hidden rounded-md border bg-white shadow-sm my-0">
                  <Link
                    href={`/dashboard/events/new`}
                    className={`flex items-center rounded-lghover:bg-gray-100 hover:text-gray-700`}
                  >
                    <button
                      className="inline-block py-2 px-4 text-gray-700 hover:bg-gray-50 focus:relative"
                      title="View Orders"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                        />
                      </svg>
                    </button>
                    <button className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
                      Create Event
                    </button>
                  </Link>
                </span>
              </div>

              <button
                type="button"
                className="group flex shrink-0 items-center rounded-lg transition"
              >
                <span className="sr-only">Menu</span>
                <img
                  alt="Man"
                  src={session?.user?.image!}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <p className="ml-2 hidden text-left text-xs sm:block">
                  <strong className="block font-medium">
                    {session?.user?.name}
                  </strong>

                  <span className="block text-gray-500">
                    {session?.user?.email}
                  </span>
                  <LoginBtn />
                </p>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-4 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 sm:block"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header> */}
    </>
  );
}
