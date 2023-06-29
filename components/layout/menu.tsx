"use client";
import { Fragment } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import { menuAtom } from "@/lib/atoms";
import Image from "next/image";

const userNavigation = [
  // { name: "Your Profile", href: "/dashboard/profile" },
  // { name: "Settings", href: "/dashboard/settings" },
  { name: "Sign in", href: "/login" },
  { name: "Sign in", href: "/login" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function HeaderMenu() {
  const [sidebarOpen, setSidebarOpen] = useAtom(menuAtom);
  const { data: session } = useSession();
  return (
    <>
      <div className="sticky top-0 z-20 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
        <button
          // type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
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
              <div className="relative ml-4 w-full text-gray-400 focus-within:text-gray-600">
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
              className="mr-2 inline-block rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-purple-600 hover:bg-opacity-75"
            >
              Create an event
            </a>
            {/* <button
              type="button"
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button> */}

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-0 mr-4">
              <div>
                <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
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
                  {session?.user?.email !== undefined ? (
                    <>
                      <Menu.Item key={1}>
                        <a
                          className={
                            "block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          }
                          href="/dashboard/events"
                          // onClick={() => signOut()}
                        >
                          My events
                        </a>
                      </Menu.Item>
                      <Menu.Item key={2}>
                        <a
                          className={
                            "block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          }
                          onClick={() => signOut()}
                        >
                          Sign out
                        </a>
                      </Menu.Item>
                    </>
                  ) : (
                    userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }: { active: any }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}
