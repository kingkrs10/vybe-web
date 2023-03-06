import Image from "next/image";
import AxiosClient from "@/lib/axios";
import moment from "moment";
import { getCurrentUser, getSession } from "@/lib/session";
import { PlusIcon } from "@heroicons/react/20/solid";

async function getData() {
  const session = await getCurrentUser();
  const params = { uid: session?.data?.userId, pageNo: 1 };
  const response = await AxiosClient().get(
    `/events/all?uid=${params.uid}&pageNo=${params.pageNo}`
  );
  return response.data.data;
}

export default async function Events() {
  const data = await getData();
  return (
    <div className="">
      <section className="mt-4 rounded-lg rounded-b-none border-2 border-gray-100 bg-white">
        {/* <nav className="flex border-b border-gray-100 text-sm font-medium">
          <a
            href=""
            className="-mb-px border-b border-current p-4 text-purple-500"
          >
            All
          </a>

          <a
            href=""
            className="-mb-px border-b border-transparent p-4 hover:text-purple-500"
          >
            Drafts
          </a>

          <a
            href=""
            className="-mb-px border-b border-transparent p-4 hover:text-purple-500"
          >
            Published
          </a>

          <a
            href=""
            className="-mb-px border-b border-transparent p-4 hover:text-purple-500"
          >
            Ended
          </a>
        </nav> */}
        {data.length === 0 && (
          <div className="h-96 content-center pt-16 text-center align-middle">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No events
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new event now.
            </p>
            <div className="mt-6">
              <a href="/dashboard/events/new">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create event
                </button>
              </a>
            </div>
          </div>
        )}
        {data.length !== 0 && (
          <div className="divide-y divide-solid divide-gray-100">
            {data.map((item: any, index: any) => (
              <article className="relative bg-white" key={index}>
                <div className="absolute right-2 top-2 inline-flex items-stretch rounded-md border bg-white">
                  <a
                    href={`/dashboard/events/information/${item.eventId}`}
                    className="rounded-l-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                  >
                    Edit
                  </a>

                  {/* <div className="relative">
                  <button
                    type="button"
                    className="inline-flex h-full items-center justify-center rounded-r-md border-l border-gray-100 px-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <span className="sr-only">Menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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

                  <div
                    className="absolute right-0 z-10 mt-4 w-56 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg"
                    role="menu"
                  >
                    <div className="p-2">
                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        role="menuitem"
                      >
                        View
                      </a>

                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        role="menuitem"
                      >
                        Edit
                      </a>

                      <form method="POST" action="#">
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          role="menuitem"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div> */}
                </div>
                <div className="flex items-start p-6">
                  <a
                    href={`/dashboard/events/overview/${item.eventId}`}
                    className="relative block shrink-0"
                  >
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="-ml-1 mr-1.5 h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg> */}

                        <p className="whitespace-nowrap text-sm">
                          {item.isActive ? "Published" : "Draft"}
                        </p>
                      </span>
                    </div>
                    <Image
                      alt="Speaker"
                      src={item.image ? item.image : "/login.jpeg"}
                      className="h-24 w-48 rounded-lg object-cover"
                      width={192}
                      height={108}
                    />
                  </a>

                  <div className="ml-4">
                    <h3 className="font-medium sm:text-lg">
                      <a
                        href={`/dashboard/events/overview/${item.eventId}`}
                        className="hover:underline"
                      >
                        {item.name}
                      </a>
                    </h3>

                    <p className="text-sm text-gray-700 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-2 sm:flex sm:items-center sm:gap-2">
                      <div className="flex items-center text-gray-500">
                        {/* <svg
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
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg> */}
                        <p className="text-xs">
                          {moment(item.startDate).format(
                            "MMMM, Do YYYY — h:mm A"
                          )}
                        </p>
                      </div>

                      {item.address && item.city && (
                        <>
                          <span className="hidden sm:block" aria-hidden="true">
                            &middot;
                          </span>
                          <p className="text-xs">
                            {item.address}, {item.city}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
