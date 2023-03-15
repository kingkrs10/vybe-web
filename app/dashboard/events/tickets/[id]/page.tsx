"use client";
import { useEffect, useState } from "react";
import ApiClient from "@/lib/axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function statusDetail(startDate: any, endDate: any) {
  const date = Date.now();
  const today = new Date(date).toISOString();
  // console.log(startDate, endDate, today);
  if (startDate >= today && endDate <= today) {
    return (
      <>
        <strong className="rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
          On sale
        </strong>
        <p className="mt-2 text-xs">
          Ends {moment(endDate).format("MMMM, Do YYYY")}
        </p>
      </>
    );
  } else if (startDate > today) {
    return (
      <>
        <strong className="rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
          Scheduled
        </strong>
        <p className="mt-2 text-xs">
          Ends {moment(endDate).format("MMMM, Do YYYY")}
        </p>
      </>
    );
  } else if (endDate < today) {
    return (
      <>
        <strong className="rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
          Ended
        </strong>
        <p className="mt-2 text-xs">
          Ends {moment(endDate).format("MMMM, Do YYYY")}
        </p>
      </>
    );
  }
}

export default function Tickets({ params }: { params: any }) {
  // const [eventId, setEventId] = useState("");

  const [ticketName, setTicketName] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState("");
  const [ticketLimit, setTicketLimit] = useState("");
  const [ticketStartDate, setTicketStartDate] = useState("");
  const [ticketEndDate, setTicketEndDate] = useState("");
  const [ticketInvitationOnly, setTicketInvitationOnly] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState(false);

  // const [session, setSession] = useState<any>({});

  // const route = useRouter();

  const createTicket = async () => {
    const data = {
      eventId: params.id,
      name: ticketName,
      description: ticketDescription,
      type: ticketType,
      price: parseFloat(ticketPrice),
      quantity: ticketQuantity,
      limit: ticketLimit,
      startDate: new Date(ticketStartDate),
      endDate: new Date(ticketEndDate),
      invitationOnly: ticketInvitationOnly,
    };
    try {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      const response = await ApiClient(user?.token).post(`/tickets`, data);
      console.log(response);
      if (response.data.data) {
        getTickets(params.id);
        setNewTicket(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTickets(params.id);
  }, [params.id]);

  // useEffect(() => {
  //   getTickets(params.id);
  // }, [tickets]);

  const getTickets = async (eventId: any) => {
    const session = await fetch(`/api/session`);
    let user = await session.json();
    const data = { eventId: eventId, pageNo: 1 };
    const response = await ApiClient(user?.token).get(
      `/tickets/all?eventId=${data.eventId}&pageNo=${data.pageNo}`
    );
    setTickets(response.data.data);
  };

  const deleteTicket = async (id: any) => {
    try {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      const response = await ApiClient(user?.token).delete(`/tickets/${id}`);
      // console.log(response);
      if (response.data) {
        getTickets(params.id);
        // setNewTicket(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const data = await getData(params.id);
  return (
    <div className="">
      {tickets?.length === 0 && !newTicket && (
        <section className="">
          <div className="p-8 md:p-12 lg:px-16 lg:py-24">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Create tickets
              </h2>

              <p className="hidden text-gray-500 sm:mt-4 sm:block">
                No tickets have been created for your event yet but you can try
                creating one.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-xl items-center justify-center">
              <form
                action="#"
                className="items-center justify-center sm:flex sm:gap-4"
              >
                <a
                  href="/dashboard/events"
                  className="group mt-4 flex rounded-md border border-purple-600 px-8 py-3 text-black transition focus:outline-none focus:ring sm:mt-0 sm:w-auto"
                >
                  <span className="text-sm font-medium">Back to events</span>
                </a>
                <button
                  // type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setNewTicket(true);
                  }}
                  className="group mt-4 flex rounded-md bg-purple-600 px-8 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto"
                >
                  <span className="text-sm font-medium">Add ticket</span>

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
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {tickets?.length !== 0 && !newTicket && (
        <section className="mt-4 sm:mt-4">
          <div className="flex w-full items-end justify-between">
            <div className="flex justify-between">
              {/* <a
                href="/dashboard/events"
                className="group mt-4 flex rounded-md border border-purple-600 px-8 py-3 text-black transition focus:outline-none focus:ring sm:mt-0 sm:w-auto"
              >
                <span className="text-sm font-medium">Back to events</span>
              </a> */}
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setNewTicket(true);
                }}
                className="group mt-4 flex justify-self-end rounded-md bg-purple-600 px-8 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto"
              >
                <span className="text-sm font-medium">Add ticket</span>

                {/* <svg
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
                      </svg> */}
              </button>
            </div>
            {/* <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                publishEvent();
              }}
              className="group mt-4 flex justify-self-end rounded-md bg-purple-600 px-8 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto"
            >
              <span className="text-sm font-medium">Publish event</span>

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
            </button> */}
          </div>
          <div className="-mx-4 mt-4 ring-1 ring-gray-100 sm:-mx-6 md:mx-0 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-6"
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                  >
                    <div className="flex items-center gap-2">
                      Quantity
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                  >
                    <div className="flex items-center gap-2">
                      Price
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500"
                  >
                    Status
                  </th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {tickets?.map((item: any, index: any) => (
                  <tr key={index}>
                    {/* <td className="sticky inset-y-0 left-0 bg-white px-4 py-2">
                            <label className="sr-only" htmlFor="Row1">
                              Row 1
                            </label>

                            <input
                              className="h-5 w-5 rounded border-gray-200"
                              type="checkbox"
                              id="Row1"
                            />
                          </td> */}
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.price}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      {statusDetail(item.startDate, item.endDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <a
                        // href="#"
                        onClick={() => {
                          deleteTicket(item.ticketId);
                        }}
                        className="text-sm font-medium text-purple-600 hover:underline"
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {newTicket && (
        <>
          <div className="mt-4 sm:mt-4">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Ticket details
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Provide ticket details for different tiers, benefits, etc.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <form action="#" method="POST">
                  <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="bg-white px-4 py-5 sm:p-6">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Ticket type
                      </label>
                      <div className="mt-1 grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <fieldset className="grid grid-cols-2 gap-4">
                            <div className="">
                              <input
                                type="radio"
                                name="ticketType"
                                value="free"
                                id="free"
                                className="peer hidden [&:checked_+_label_svg]:block"
                                checked={ticketType === "free"}
                                // checked
                                onChange={(text) =>
                                  setTicketType(text.target.value)
                                }
                              />

                              <label
                                htmlFor="free"
                                className="block cursor-pointer rounded-lg border border-gray-100 p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-purple-500 peer-checked:ring-1 peer-checked:ring-purple-500"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-700">Free</p>
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
                                    />
                                  </svg>
                                </div>
                              </label>
                            </div>

                            <div className="">
                              <input
                                type="radio"
                                name="ticketType"
                                value="paid"
                                id="paid"
                                checked={ticketType === "paid"}
                                // checked
                                onChange={(text) =>
                                  setTicketType(text.target.value)
                                }
                                className="peer hidden [&:checked_+_label_svg]:block"
                              />

                              <label
                                htmlFor="paid"
                                className="block cursor-pointer rounded-lg border border-gray-100 p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-purple-500 peer-checked:ring-1 peer-checked:ring-purple-500"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-700">Paid</p>
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
                                    />
                                  </svg>
                                </div>
                              </label>
                            </div>
                          </fieldset>
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Ticket name
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            {/* <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                          http://
                        </span> */}
                            <input
                              type="text"
                              onChange={(text) =>
                                setTicketName(text.target.value)
                              }
                              name="ticketName"
                              id="ticketName"
                              className="block w-full flex-1 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              placeholder="Event name"
                              value={ticketName}
                            />
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quantity
                          </label>
                          <input
                            type="text"
                            name="ticketQuantity"
                            id="ticketQuantity"
                            value={ticketQuantity}
                            onChange={(text) =>
                              setTicketQuantity(text.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          />
                        </div>

                        {ticketType === "paid" && (
                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label
                              htmlFor="region"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Price
                            </label>
                            <input
                              type="text"
                              name="ticketPrice"
                              id="ticketPrice"
                              value={ticketPrice}
                              onChange={(text) =>
                                setTicketPrice(text.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                        )}

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Purchase limit
                          </label>
                          <input
                            type="text"
                            name="ticketLimit"
                            id="ticketLimit"
                            value={ticketLimit}
                            onChange={(text) =>
                              setTicketLimit(text.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          >
                            Save
                          </button>
                        </div> */}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-200" />
            </div>
          </div>

          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Additional information
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Let your guests know when your tickets sales starts and
                    ends.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <form action="#" method="POST">
                  <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                      <fieldset>
                        <div className="mt-0 space-y-4">
                          <div>
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="description"
                                name="description"
                                onChange={(text) =>
                                  setTicketDescription(text.target.value)
                                }
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                placeholder="Tell everyone about your event."
                                value={ticketDescription}
                                // defaultValue={""}
                              />
                            </div>
                            {/* <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p> */}
                          </div>

                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
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
                                </span>
                                {/* <input
                                        type="text"
                                        name="start-date"
                                        id="start-date"
                                        value={ticketStartDate}
                                        onChange={(text) =>
                                          setTicketStartDate(text.target.value)
                                        }
                                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        placeholder="01/01/2024"
                                      /> */}
                                <DatePicker
                                  name="start-date"
                                  id="start-date"
                                  selected={ticketStartDate}
                                  onChange={(date) => setTicketStartDate(date)}
                                  timeInputLabel="Time:"
                                  dateFormat="MM/dd/yyyy h:mm aa"
                                  showTimeInput
                                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
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
                                </span>
                                {/* <input
                                        type="text"
                                        name="end-date"
                                        id="end-date"
                                        value={ticketEndDate}
                                        onChange={(text) =>
                                          setTicketEndDate(text.target.value)
                                        }
                                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        placeholder="01/01/2024"
                                      /> */}
                                <DatePicker
                                  name="end-date"
                                  id="end-date"
                                  selected={ticketEndDate}
                                  onChange={(date) => setTicketEndDate(date)}
                                  timeInputLabel="Time:"
                                  dateFormat="MM/dd/yyyy h:mm aa"
                                  showTimeInput
                                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            {/* <div className="col-span-6 sm:col-span-3">
                                    <label
                                      htmlFor="start-time"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Start time
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
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
                                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                      </span>
                                      <input
                                        type="text"
                                        name="start-time"
                                        id="start-time"
                                        value={ticketStartTime}
                                        onChange={(text) =>
                                          setTicketStartTime(text.target.value)
                                        }
                                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        placeholder="2:00 PM"
                                      />
                                    </div>
                                  </div> */}
                          </div>

                          {/* <div className="grid grid-cols-6 gap-6">
                                  

                                  <div className="col-span-6 sm:col-span-3">
                                    <label
                                      htmlFor="end-time"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      End time
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
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
                                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                      </span>
                                      <input
                                        type="text"
                                        name="end-time"
                                        id="end-time"
                                        value={ticketEndTime}
                                        onChange={(text) =>
                                          setTicketEndTime(text.target.value)
                                        }
                                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        placeholder="3:00 PM"
                                      />
                                    </div>
                                  </div>
                                </div> */}

                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="end-visible"
                                name="end-visible"
                                type="checkbox"
                                // value={ticketInvitationOnly}
                                checked={ticketInvitationOnly}
                                onChange={(text) =>
                                  setTicketInvitationOnly(text.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="end-visible"
                                className="font-medium text-gray-700"
                              >
                                Ticket sales only by invitation
                              </label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          setNewTicket(false);
                        }}
                        className="inline-flex justify-center rounded border border-purple-600 py-2 px-4 text-sm font-medium text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:bg-purple-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          createTicket();
                        }}
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      {/* <section className="">
        <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="sticky inset-y-0 left-0 bg-gray-100 px-4 py-2 text-left">
                  <label className="sr-only" htmlFor="SelectAll">
                    Select All
                  </label>

                  <input
                    className="h-5 w-5 rounded border-gray-200"
                    type="checkbox"
                    id="SelectAll"
                  />
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    Name
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    Quantity
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    Price
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Status
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.map((item: any, index: any) => (
                <tr key={index}>
                  <td className="sticky inset-y-0 left-0 bg-white px-4 py-2">
                    <label className="sr-only" htmlFor="Row1">
                      Row 1
                    </label>

                    <input
                      className="h-5 w-5 rounded border-gray-200"
                      type="checkbox"
                      id="Row1"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {item.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    {statusDetail(item.startDate, item.endDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}
    </div>
  );
}
