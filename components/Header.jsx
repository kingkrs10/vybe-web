"use client";
import Link from "next/link";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
// import { Logo } from "@/components/Logo";
import Logo from "./layout/logo";
import { NavLinks } from "@/components/NavLinks";
import { useSession, signOut } from "next-auth/react";

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavLink({ children, ...props }) {
  return (
    <Popover.Button
      as={Link}
      passHref
      className="block text-base leading-7 tracking-tight text-gray-700"
      {...props}
    >
      {children}
    </Popover.Button>
  );
}

export function Header({ session }) {
  // const { data: session } = useSession();
  return (
    <div>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            <Link href="/" passHref aria-label="Home">
              <Logo />
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* <Link
              href={`/`}
              className="hidden whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 md:block"
            >
              Discover events
            </Link> */}
            {/* <Link
              href={`/dashboard/events/new`}
              className="ml-6 hidden whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 md:block"
            >
              Create an event
            </Link> */}
            <div className="hidden md:block">
              {session?.data === undefined ? (
                <Link
                  href="/login"
                  passHref
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700"
                >
                  Sign in
                </Link>
              ) : (
                <div className="flex justify-between">
                  <Link
                    className="mb-2 inline-block h-11 items-center justify-center whitespace-nowrap rounded-md border bg-white px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-100"
                    href="/dashboard/events"
                    passHref
                  >
                    My events
                  </Link>
                  <Link
                    href={"#"}
                    passHref
                    onClick={() => signOut()}
                    className="ml-4 inline-block h-11 w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <Popover.Button
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </Popover.Button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <Popover.Overlay
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                        />
                        <Popover.Panel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="#features">
                              Features
                            </MobileNavLink>
                            <MobileNavLink href="#reviews">
                              Reviews
                            </MobileNavLink>
                            <MobileNavLink href="#pricing">
                              Pricing
                            </MobileNavLink>
                            <MobileNavLink href="#faqs">FAQs</MobileNavLink>
                          </div>
                          <div className="mt-8 flex flex-col gap-4">
                            {session?.data === undefined ? (
                              // <Link
                              //   href="/login"
                              //   passHref
                              //   className="flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700"
                              // >
                              //   Sign in
                              // </Link>
                              <Button href="/login" variant="outline">
                                Log in
                              </Button>
                            ) : (
                              <div className="flex flex-col gap-3">
                                {/* <Link
                                  className="mb-2 inline-block h-11 items-center justify-center whitespace-nowrap rounded-md border bg-white px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-100"
                                  href="/dashboard/events"
                                  passHref
                                >
                                  My events
                                </Link>
                                <Link
                                  href={"#"}
                                  passHref
                                  onClick={() => signOut()}
                                  className="ml-4 inline-block h-11 w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700"
                                >
                                  Sign out
                                </Link> */}
                                <Button
                                  href="/dashboard/events"
                                  variant="outline"
                                >
                                  My events
                                </Button>
                                <Button
                                  href={"#"}
                                  passHref
                                  onClick={() => signOut()}
                                >
                                  Sign out
                                </Button>
                              </div>
                            )}
                            {/* <Button href="/login" variant="outline">
                              Log in
                            </Button> */}
                            {/* <Button href="#">Download the app</Button> */}
                          </div>
                        </Popover.Panel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
          </div>
        </Container>
      </nav>
    </div>
  );
}
