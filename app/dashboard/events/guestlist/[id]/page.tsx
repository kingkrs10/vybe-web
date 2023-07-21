"use client";
import ApiClient from "@/lib/axios";
import { useEffect, useState, Fragment } from "react";
import { QrReader } from "react-qr-reader";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Guestlists({ params }: { params: any }) {
  const [scan, setScan] = useState(false);
  const [gueslist, setData] = useState([]);
  const [camera, setCamera] = useState("");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      const request = { pageNo: 1 };
      const response = await ApiClient(user?.token).get(
        `/guestlists/all?eventId=${params?.id}&pageNo=${request.pageNo}`
      );
      // console.log(response.data.data);
      setData(response?.data?.data || []);
    })();
  }, [params.id]);

  useEffect(() => {
    (async () => {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      const guestlist = await ApiClient(user?.token).patch(
        `/guestlists/checkin/${camera}`
      );
      if (guestlist.data.data) {
        setShow(true);
        setName(guestlist.data.data.name);

        const request = { pageNo: 1 };
        const response = await ApiClient(user?.token).get(
          `/guestlists/all?eventId=${params?.id}&pageNo=${request.pageNo}`
        );

        setData(response?.data?.data);
        setTimeout(() => {
          setShow(false);
          setName("");
        }, 3000);
      }
    })();
  }, [camera, params?.id]);

  const stats = [{ name: "Total guests", stat: gueslist?.length }];

  return (
    <>
      {scan && (
        <>
          <div className="w-full items-end text-right">
            <button
              onClick={(e) => {
                e.preventDefault();
                setScan(false);
                setCamera("");
                // QrReader?.stop();
              }}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-800"
            >
              Close Scanner
            </button>
          </div>
          <div id="reader" className="mt-6 h-full w-full">
            <QrReader
              scanDelay={1000}
              constraints={{
                facingMode: "environment",
              }}
              onResult={(result: any, error: any) => {
                if (!!result) {
                  setCamera(result?.text);
                }
                if (!!error) {
                  console.info(error);
                }
              }}
              // style={{ width: "100%", height: "100%" }}
              className="top-8 h-full w-full"
              // videoContainerStyle={{ width: "100%", height: "100%" }}
            />
          </div>
        </>
      )}

      {!scan && (
        <div className="">
          <article className="mb-4">
            <div className="w-full items-end text-right">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setScan(true);
                  setCamera("");
                }}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-800"
              >
                Scan Ticket
              </button>
            </div>
            <div>
              {/* <h3 className="text-lg font-medium leading-6 text-gray-900">
            Last 30 days
          </h3> */}
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.name}
                    className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                  >
                    <dt className="truncate text-sm font-medium text-gray-500">
                      {item.name}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {item.stat}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>

          <section className="">
            <div className="-mx-4 mt-4 ring-1 ring-gray-100 sm:-mx-6 md:mx-0 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-6"
                    >
                      Guest name
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                    >
                      Ticket name
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                    >
                      Checked In
                    </th>
                    {/* <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                >
                  Processing fee
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-right text-sm font-semibold text-gray-500"
                >
                  Ticket revenue
                </th> */}
                    {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Select</span>
                  </th> */}
                  </tr>
                </thead>
                <tbody>
                  {gueslist.map((plan: any, planIdx: any) => (
                    <tr key={planIdx}>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-gray-900">
                          {plan.name}
                        </div>
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {plan.type}
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {plan.email}
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {plan.transactionId.split("-")[0]}
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {plan.checkedIn === true ? "Yes" : "No"}
                      </td>
                      {/* <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {plan.storage}
                  </td>
                  <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-gray-200",
                      "px-3 py-3.5 text-right text-sm text-gray-500"
                    )}
                  >
                    <div className="sm:hidden">{plan.price}</div>
                    <div className="hidden sm:block">{plan.price}</div>
                  </td> */}
                      {/* <td
                      className={classNames(
                        planIdx === 0 ? "" : "border-t border-transparent",
                        "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                      )}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                        disabled={plan.isCurrent}
                      >
                        Select<span className="sr-only">, {plan.name}</span>
                      </button>
                      {planIdx !== 0 ? (
                        <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" />
                      ) : null}
                    </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-20 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {name} checked in!
                    </p>
                    {/* <p className="mt-1 text-sm text-gray-500">
                        Anyone with a link can now view this file.
                      </p> */}
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false);
                        setName("");
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
