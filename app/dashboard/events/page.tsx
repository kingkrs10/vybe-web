import Image from "next/image";
import axios from "axios";
import moment from "moment";
// import styles from "./page.module.css";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

async function getData() {
  // console.log("test");
  const session = await unstable_getServerSession(authOptions);
  // console.log(session);

  const params = { uid: session?.user.userData?.userId, pageNo: 1 };
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIURL}/events/all?uid=${params.uid}&pageNo=${params.pageNo}`
  );
  return response.data.data;
}

export default async function Events() {
  const data = await getData();
  // console.log(data);
  return (
    <div className="">
      <section className="bg-white border-2 border-gray-100 rounded-lg rounded-b-none mt-4">
        <nav className="flex border-b border-gray-100 text-sm font-medium">
          <a
            href=""
            className="-mb-px border-b border-current p-4 text-cyan-500"
          >
            All
          </a>

          <a
            href=""
            className="-mb-px border-b border-transparent p-4 hover:text-cyan-500"
          >
            Drafts
          </a>

          <a
            href=""
            className="-mb-px border-b border-transparent p-4 hover:text-cyan-500"
          >
            Published
          </a>

          <a
            href=""
            className="-mb-px border-b border-transparent p-4 hover:text-cyan-500"
          >
            Ended
          </a>
        </nav>
        <div className="divide-y divide-gray-100 divide-solid">
          {data.map((item: any, index: any) => (
            <article className="bg-white relative" key={index}>
              <div className="inline-flex absolute right-2 top-2 items-stretch rounded-md border bg-white">
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
                  className="block relative shrink-0"
                >
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                      <svg
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
                      </svg>

                      <p className="whitespace-nowrap text-sm">Draft</p>
                    </span>
                  </div>
                  <img
                    alt="Speaker"
                    src={item.image ? item.image : "/login.jpeg"}
                    className="h-24 w-48 rounded-lg object-cover"
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
                        {moment(item.startDate).format("MMMM, Do YYYY")} &mdash;{" "}
                        {moment(item.startTime, "HH:mm:ss").format("h:mm A")}
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
      </section>
    </div>
  );
}
