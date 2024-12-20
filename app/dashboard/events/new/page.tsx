"use client";
import React, { useEffect, useState, useRef, use } from "react";
import categoryList from "@/resources/categories.json";
import countryList from "@/resources/countries-cities.json";
import timezones from "@/resources/timezones.json";
import axios from "axios";
import { getSession } from "next-auth/react";
import moment from "moment";
import {
  StandaloneSearchBox,
  LoadScript,
  useLoadScript,
} from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { redirect, useRouter } from "next/navigation";
import ApiClient from "@/lib/axios";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { UUID } from "crypto";

// const categoryList = dynamic(() => require("@/resources/categories.json"));
// const timezones = dynamic(() => require("@/resources/timezones.json"));
// const countryList = dynamic(() => require("@/resources/countries-cities.json"));

const lib: any = ["places"];

export default function NewTicket() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [address, setAddress] = useState({ address: "", lat: 0, lng: 0 });
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [manual, setManual] = useState(false);
  const [virtualUrl, setVirtualUrl] = useState("");
  const [password, setPassword] = useState("");
  const [timezone, setTimezone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endVisible, setEndVisible] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [image, setImage] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");

  const [step, setStep] = useState(1);
  const [eventId, setEventId] = useState("");

  const [ticketId, setTicketId] = useState("");
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
  const [editTicket, setEditTicket] = useState(false);

  const [session, setSession] = useState<any>({});
  const [countries, setCountries] = useState<any>([]);
  const [timezones, setTimezones] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [currencies, setCurrencies] = useState<any>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/categories`),
      fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/timezones`),
      fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/countries`),
      fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/currencies`),
    ])
      .then(([categories, timezones, countries, currencies]) => {
        return Promise.all([
          categories.json(),
          timezones.json(),
          countries.json(),
          currencies.json(),
        ]);
      })
      .then(([categories, timezones, countries, currencies]) => {
        setCountries(countries);
        setTimezones(timezones);
        setCategories(categories);
        setCurrencies(currencies);
      });
  }, []);

  const route = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // const onSubmit = handleSubmit((data) => console.log(data));

  useEffect(() => {
    (async () => {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      setSession(user);
    })();
  }, []);

  let key = country;
  // let countryname = countryList[key as keyof typeof countryList];
  // const lib = ["places"];

  const uploadPhoto = async (e: any) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-url?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(
      ([key, value]: [key: string, value: any]) => {
        formData.append(key, value);
      }
    );

    let surl: string;
    if (process.env.NODE_ENV === "development") {
      surl = "https://cors-anywhere.herokuapp.com/" + url;
    } else {
      surl = url;
    }

    const upload = await fetch(`${surl}`, {
      method: "POST",
      body: formData,
      mode: "no-cors",
      headers: {
        accept: "application/json",
      },
    });

    if (upload) {
      setImage(`${url}${filename}`);
    }
  };

  const statusDetail = (startDate: any, endDate: any) => {
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
  };

  const getTickets = async (eventId: any) => {
    const params = { eventId: eventId, pageNo: 1 };
    const response = await ApiClient(session?.token).get(
      `/tickets/all?eventId=${params.eventId}&pageNo=${params.pageNo}`
    );
    setTickets(response.data.data);
  };

  const createEvent = async () => {
    const data = {
      userId: session?.data?.userId,
      name,
      description,
      category,
      type,
      currency,
      address: address?.address,
      country,
      city,
      state,
      postalCode,
      timezone,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      endVisible,
      image,
      website,
      twitter,
      instagram,
      lat: address?.lat,
      lng: address?.lng,
    };
    try {
      const response = await ApiClient(session?.token).post(`/events`, data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const createTicket = async () => {
    const data = {
      eventId,
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
      const response = await ApiClient(session?.token).post(`/tickets`, data);
      // console.log(response);
      if (response.data.data.eventId) {
        getTickets(response.data.data.eventId);
        setNewTicket(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputRef = useRef<any>();

  const handlePlaceChanged = () => {
    const [place] = inputRef?.current?.getPlaces();
    if (place) {
      setAddress({
        address: place.formatted_address,
        lat: +place.geometry.location.lat(),
        lng: +place.geometry.location.lng(),
      });
    }
  };

  const publishEvent = async () => {
    const data = {
      isActive: true,
    };
    try {
      const response = await ApiClient(session?.token).patch(
        `/events/publish/${eventId}`,
        data
      );
      if (response.data.data.eventId) {
        route.push("/dashboard/events");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearFields = () => {
    // const ticketsList = tickets.find((ticket: any) => {
    //   return ticket.ticketId === item;
    // });
    // console.log(ticketsList);
    setTicketId("");
    setTicketName("");
    setTicketDescription("");
    setTicketType("");
    setTicketPrice("");
    setTicketQuantity("");
    setTicketLimit("");
    setTicketStartDate("");
    setTicketEndDate("");
    setTicketInvitationOnly(false);
  };

  type List = {
    ticketId: string;
    name: string;
    description: string;
    type: string;
    price: string;
    quantity: string;
    limit: string;
    startDate: string;
    endDate: string;
    invitationOnly: boolean;
  };

  const setFields = (item: any): any => {
    // const ticketsList: List = tickets.find((ticket: any) => {
    //   return ticket.ticketId === item;
    // });
    // console.log(ticketsList);
    setTicketId(item?.ticketId!);
    setTicketName(item?.name!);
    setTicketDescription(item?.description!);
    setTicketType(item?.type!);
    setTicketPrice(item?.price!);
    setTicketQuantity(item?.quantity!);
    setTicketLimit(item?.limit!);
    setTicketStartDate(item?.startDate!);
    setTicketEndDate(item?.endDate!);
    setTicketInvitationOnly(item?.invitationOnly!);
  };

  const updateTicket = async (id: any) => {
    const data = {
      id: id,
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
      const response = await ApiClient(user?.token).patch(
        `/tickets/${id}`,
        data
      );
      // console.log(response);
      if (response.data.data) {
        getTickets(eventId);
        setEditTicket(false);
        clearFields();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTicket = async (id: any) => {
    try {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      const response = await ApiClient(user?.token).delete(`/tickets/${id}`);
      // console.log(response);
      if (response.data) {
        getTickets(eventId);
        // setNewTicket(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
      libraries={lib}
    >
      <div className="">
        <section className="rounded-lg bg-gray-900 text-white">
          <div className="max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-start">
              <span className="flex-shrink-0 rounded-lg bg-gray-800 p-4">
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
                    d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                  />
                </svg>
              </span>

              <div className="ml-4 w-full">
                <h2 className="text-lg font-bold">Let’s get you all set up </h2>

                <div>
                  <h2 className="sr-only">Steps</h2>

                  <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
                    <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
                      <li
                        onClick={() => setStep(1)}
                        className="flex items-center bg-gray-900 p-2"
                      >
                        <span
                          className={
                            step == 1
                              ? "h-6 w-6 rounded-full bg-purple-600 text-center text-[10px] font-bold leading-6 text-white"
                              : "h-6 w-6 rounded-full bg-gray-100 text-center text-[10px] font-bold leading-6"
                          }
                        >
                          1
                        </span>

                        <span className="hidden sm:ml-2 sm:block">
                          Event Info
                        </span>
                      </li>

                      <li
                        onClick={() => setStep(2)}
                        className="flex items-center bg-gray-900 p-2"
                      >
                        <span
                          className={
                            step == 2
                              ? "h-6 w-6 rounded-full bg-purple-600 text-center text-[10px] font-bold leading-6 text-white"
                              : "h-6 w-6 rounded-full bg-gray-100 text-center text-[10px] font-bold leading-6"
                          }
                        >
                          2
                        </span>
                        <span className="hidden sm:ml-2 sm:block">Uploads</span>
                      </li>

                      <li
                        onClick={() => setStep(3)}
                        className="flex items-center bg-gray-900 p-2"
                      >
                        <span
                          className={
                            step == 3
                              ? "h-6 w-6 rounded-full bg-purple-600 text-center text-[10px] font-bold leading-6 text-white"
                              : "h-6 w-6 rounded-full bg-gray-100 text-center text-[10px] font-bold leading-6"
                          }
                        >
                          3
                        </span>
                        <span className="hidden sm:ml-2 sm:block">Tickets</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </section>
        {/* This is where the event details will be */}
        {step === 1 && (
          <>
            <form
              onSubmit={handleSubmit((data) => {
                setName(data.name);
                setDescription(data.description);
                setStep(2);
              })}
            >
              <div>
                <div className="mt-4 md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Basics
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Let your guests know more about your event
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                      <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <div className="">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Event name
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="text"
                              id="name"
                              className="block w-full flex-1 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              placeholder="Event name"
                              value={name}
                              {...register("name", {
                                required: true,
                                onChange: (e) => {
                                  setName(e.target.value);
                                },
                              })}
                            />
                          </div>
                          {errors.name && (
                            <p className="mt-2 text-sm text-rose-600">
                              Event name is required.
                            </p>
                          )}
                        </div>

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
                              rows={3}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              placeholder="Tell everyone about your event."
                              value={description}
                              {...register("description", {
                                required: true,
                                onChange: (e) => {
                                  setDescription(e.target.value);
                                },
                              })}
                            />
                          </div>
                          {errors.description && (
                            <p className="mt-2 text-sm text-rose-600">
                              Event description is required.
                            </p>
                          )}
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Category
                          </label>
                          <select
                            id="category"
                            value={category}
                            {...register("category", {
                              required: true,
                              onChange: (e) => {
                                setCategory(e.target.value);
                              },
                            })}
                            autoComplete="category"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                          >
                            <option value="">Select category</option>
                            {Object.keys(categories)
                              .sort()
                              .map((key, index) => {
                                return (
                                  <option key={index} value={key}>
                                    {key}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.category && (
                            <p className="mt-2 text-sm text-rose-600">
                              Event category is required.
                            </p>
                          )}
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Currency
                          </label>
                          <select
                            id="currency"
                            value={currency}
                            {...register("currency", {
                              required: true,
                              onChange: (e) => {
                                setCurrency(e.target.value);
                              },
                            })}
                            // autoComplete="category"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                          >
                            <option value="">Select currency</option>
                            {currencies.map((key: any, index: number) => {
                              return (
                                <option key={index} value={key.code}>
                                  {key.name}
                                </option>
                              );
                            })}
                          </select>
                          {errors.currency && (
                            <p className="mt-2 text-sm text-rose-600">
                              Event currency is required.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
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
                        Location
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Provide venue tips to enable everyone find your event
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6">
                            <fieldset className="grid grid-cols-2 gap-4">
                              <legend className="sr-only">Delivery</legend>
                              <div className="">
                                <input
                                  type="radio"
                                  value="live"
                                  id="live"
                                  className="peer hidden [&:checked_+_label_svg]:block"
                                  checked={type === "live"}
                                  {...register("type", {
                                    required: true,
                                    onChange: (e) => {
                                      setType(e.target.value);
                                    },
                                  })}
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
                                      />
                                    </svg>
                                  </div>
                                </label>
                              </div>

                              <div className="">
                                <input
                                  type="radio"
                                  value="virtual"
                                  id="virtual"
                                  checked={type === "virtual"}
                                  {...register("type", {
                                    required: true,
                                    onChange: (e) => {
                                      setType(e.target.value);
                                      setManual(false);
                                    },
                                  })}
                                  className="peer hidden [&:checked_+_label_svg]:block"
                                />

                                <label
                                  htmlFor="virtual"
                                  className="block cursor-pointer rounded-lg border border-gray-100 p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-purple-500 peer-checked:ring-1 peer-checked:ring-purple-500"
                                >
                                  <div className="flex items-center justify-between">
                                    <p className="text-gray-700">
                                      Virtual event
                                    </p>
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
                            {errors.type && (
                              <p className="mt-2 text-sm text-rose-600">
                                Event type is required.
                              </p>
                            )}
                          </div>

                          {type === "virtual" && (
                            <>
                              <div className="col-span-6">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Vitual link
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
                                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                                      />
                                    </svg>
                                  </span>
                                  <input
                                    type="text"
                                    name="virtualUrl"
                                    id="virtualUrl"
                                    value={virtualUrl}
                                    onChange={(text) =>
                                      setVirtualUrl(text.target.value)
                                    }
                                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Vitual address"
                                  />
                                </div>
                                <p className="mx-1 mt-2 text-sm text-gray-500">
                                  Virtual event links will be made provided to
                                  guests upon ticket purchase.
                                </p>
                              </div>

                              <div className="col-span-6">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Password{" "}
                                  <span className="text-sm text-gray-500">
                                    (optional)
                                  </span>
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
                                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                      />
                                    </svg>
                                  </span>
                                  <input
                                    type="text"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(text) =>
                                      setPassword(text.target.value)
                                    }
                                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Password"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {type === "live" && (
                            <>
                              <div className="col-span-6">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Search for location
                                </label>
                                <StandaloneSearchBox
                                  onLoad={(ref) => (inputRef.current = ref)}
                                  onPlacesChanged={handlePlaceChanged}
                                >
                                  <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    className="form-control block w-full flex-1 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Your address"
                                  />
                                </StandaloneSearchBox>
                              </div>

                              <div className="col-span-6">
                                <div className="flex items-start">
                                  <div className="flex h-5 items-center">
                                    <input
                                      id="manual"
                                      name="manual"
                                      type="checkbox"
                                      checked={manual}
                                      onChange={(text) =>
                                        setManual(text.target.checked)
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label
                                      htmlFor="manual"
                                      className="font-medium text-gray-700"
                                    >
                                      Enter location manually
                                    </label>
                                    <p className="text-gray-500">
                                      If you are not able to find the location
                                      above, you can enter it yourself.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {manual && (
                                <>
                                  <div className="col-span-6">
                                    <label
                                      htmlFor="country"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Country
                                    </label>
                                    <select
                                      id="country"
                                      name="country"
                                      onChange={(text) =>
                                        setCountry(text.target.value)
                                      }
                                      autoComplete="country-name"
                                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                                    >
                                      {Object.keys(countries)
                                        .sort()
                                        .map((key, index) => {
                                          return (
                                            <option key={index} value={key}>
                                              {key}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  </div>

                                  <div className="col-span-6">
                                    <label
                                      htmlFor="street-address"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Street address
                                    </label>
                                    <input
                                      type="text"
                                      name="address"
                                      id="address"
                                      autoComplete="street-address"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                    <label
                                      htmlFor="city"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      City
                                    </label>
                                    <select
                                      id="city"
                                      name="city"
                                      value={city}
                                      onChange={(text) =>
                                        setCity(text.target.value)
                                      }
                                      autoComplete="country-name"
                                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                                    >
                                      {countries
                                        ?.sort()
                                        .map((key: any, index: any) => {
                                          return (
                                            <option key={index} value={key}>
                                              {key}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  </div>

                                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label
                                      htmlFor="region"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      State / Province
                                    </label>
                                    <input
                                      type="text"
                                      name="region"
                                      id="region"
                                      value={state}
                                      onChange={(text) =>
                                        setState(text.target.value)
                                      }
                                      autoComplete="address-level1"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label
                                      htmlFor="postal-code"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      ZIP / Postal code
                                    </label>
                                    <input
                                      type="text"
                                      name="postal-code"
                                      id="postal-code"
                                      value={postalCode}
                                      onChange={(text) =>
                                        setPostalCode(text.target.value)
                                      }
                                      autoComplete="postal-code"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-100 px-4 py-3 sm:px-6">
                        <div className="col-span-6">
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="mapVisible"
                                name="mapVisible"
                                type="checkbox"
                                checked={mapVisible}
                                onChange={(text) =>
                                  setMapVisible(text.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="mapVisible"
                                className="font-medium text-gray-700"
                              >
                                Show location 2 days before event
                              </label>
                              <p className="text-gray-500">
                                This gives you the option to create hype around
                                the event and location.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                                value={timezone}
                                {...register("timezone", {
                                  required: true,
                                  onChange: (e) => {
                                    setTimezone(e.target.value);
                                  },
                                })}
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                              >
                                <option value="">Select timezone</option>
                                {timezones
                                  .sort((a: any, b: any) => a.text - b.text)
                                  .map((key: any, index: any) => {
                                    return (
                                      <option key={index} value={key.text}>
                                        {key.text}
                                      </option>
                                    );
                                  })}
                              </select>
                              {errors.timezone && (
                                <p className="mt-2 text-sm text-rose-600">
                                  Event timezone is required.
                                </p>
                              )}
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
                                  <Controller
                                    control={control}
                                    name="startDate"
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                      <>
                                        <DatePicker
                                          // name="start-date"
                                          placeholderText="Select start date"
                                          id="startDate"
                                          selected={startDate}
                                          onChange={(date) => {
                                            onChange(date);
                                            setStartDate(date);
                                          }}
                                          timeInputLabel="Time:"
                                          dateFormat="MM/dd/yyyy h:mm aa"
                                          showTimeInput
                                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        />
                                      </>
                                    )}
                                  />
                                </div>
                                {errors.startDate && (
                                  <p className="mt-2 text-sm text-rose-600">
                                    Event start date and time are required.
                                  </p>
                                )}
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
                                  <Controller
                                    control={control}
                                    name="endDate"
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                      <>
                                        <DatePicker
                                          // name="start-date"
                                          placeholderText="Select end date"
                                          id="endDate"
                                          selected={endDate}
                                          onChange={(date) => {
                                            onChange(date);
                                            setEndDate(date);
                                          }}
                                          timeInputLabel="Time:"
                                          dateFormat="MM/dd/yyyy h:mm aa"
                                          showTimeInput
                                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        />
                                      </>
                                    )}
                                  />

                                  {/* <DatePicker
                                    name="end-date"
                                    id="end-date"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    showTimeInput
                                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  /> */}
                                </div>
                                {errors.endDate && (
                                  <p className="mt-2 text-sm text-rose-600">
                                    Event end date and time are required.
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="end-visible"
                                  name="end-visible"
                                  type="checkbox"
                                  checked={endVisible}
                                  onChange={(text) =>
                                    setEndVisible(text.target.checked)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="end-visible"
                                  className="font-medium text-gray-700"
                                >
                                  Allow attendees see the end time of your event
                                </label>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                          // // type="submit"
                          // onClick={(e) => {
                          //   // e.preventDefault();
                          //   // handleSubmit((data) => console.log(data));
                          //   // setStep(2);
                          // }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                    {/* </form> */}
                  </div>
                </div>
              </div>
            </form>
          </>
        )}

        {/* This is where we will have the upload section */}
        {step === 2 && (
          <>
            <div>
              <div className="mt-4 md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Event Image
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      This is the image that appears when your event is
                      published.
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <form action="#" method="POST">
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                      <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <div>
                          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                            <div className="space-y-1 text-center">
                              {image != "" && (
                                <div className="relative h-full w-full">
                                  <div className="absolute right-0 top-0 flex h-7 w-7 justify-center rounded-bl-md bg-white">
                                    <a
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setImage("");
                                      }}
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
                                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                    </a>
                                  </div>
                                  <Image
                                    src={image}
                                    alt="Event Image"
                                    height={200}
                                    width={200}
                                  />
                                </div>
                              )}
                              {image == "" && (
                                <>
                                  <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <div className="flex text-sm text-gray-600">
                                    <label
                                      htmlFor="image"
                                      className="relative cursor-pointer rounded-md bg-white font-medium text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:text-purple-500"
                                    >
                                      <span>Upload a file</span>
                                      <input
                                        id="image"
                                        name="image"
                                        onChange={(event) =>
                                          // setImage(text.target.value)
                                          uploadPhoto(event)
                                        }
                                        // value={image}
                                        type="file"
                                        className="sr-only"
                                      />
                                    </label>

                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
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
                      Social links
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Provide social links to let your guests learn more about
                      your event.
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <form action="#" method="POST">
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-2">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6">
                            <label
                              htmlFor="website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Website
                            </label>
                            <input
                              type="text"
                              onChange={(text) => setWebsite(text.target.value)}
                              value={website}
                              name="website"
                              id="website"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white px-4 py-2">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6">
                            <label
                              htmlFor="twitter"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Twitter
                            </label>
                            <input
                              type="text"
                              onChange={(text) => setTwitter(text.target.value)}
                              value={twitter}
                              name="twitter"
                              id="twitter"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white px-4 py-2">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6">
                            <label
                              htmlFor="website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Facebook
                            </label>
                            <input
                              type="text"
                              onChange={(text) =>
                                setFacebook(text.target.value)
                              }
                              value={facebook}
                              name="facebook"
                              id="facebook"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white px-4 py-2">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6">
                            <label
                              htmlFor="website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Instagram
                            </label>
                            <input
                              type="text"
                              onChange={(text) =>
                                setInstagram(text.target.value)
                              }
                              value={instagram}
                              name="instagram"
                              id="instagram"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                          // // type="submit"
                          onClick={async (e) => {
                            e.preventDefault();
                            const event = await createEvent();
                            // console.log(event);
                            setEventId(event.eventId);
                            if (event.eventId) setStep(3);
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                          Create event
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        {/* This is where we will have the tickets section */}
        {step === 3 && (
          <>
            {tickets.length === 0 && !newTicket && (
              <section className="">
                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                  <div className="mx-auto max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                      Create tickets
                    </h2>

                    <p className="hidden text-gray-500 sm:mt-4 sm:block">
                      No tickets have been created for your event yet but you
                      can try creating one.
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
                        <span className="text-sm font-medium">
                          Back to events
                        </span>
                      </a>
                      <button
                        // // type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          clearFields();
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

            {tickets.length !== 0 && !newTicket && (
              <section className="mt-4 sm:mt-4">
                <div className="flex w-full items-end justify-between">
                  <div className="flex justify-between">
                    <a
                      href="/dashboard/events"
                      className="group mt-4 flex rounded-md border border-purple-600 px-8 py-3 text-black transition focus:outline-none focus:ring sm:mt-0 sm:w-auto"
                    >
                      <span className="text-sm font-medium">
                        Back to events
                      </span>
                    </a>
                    <button
                      // type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        clearFields();
                        setNewTicket(true);
                      }}
                      className="group ml-4 mt-4 flex justify-self-end rounded-md bg-purple-600 px-8 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto"
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
                  <button
                    // type="submit"
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
                  </button>
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
                          className="px-3 py-3.5 text-right text-sm font-semibold text-gray-500"
                        >
                          Status
                        </th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {tickets.map((item: any, index: any) => (
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
                              onClick={(e) => {
                                e.preventDefault();
                                setFields(item);
                                setEditTicket(true);
                              }}
                              className="cursor-pointer text-sm font-medium text-purple-600 hover:underline"
                            >
                              Edit
                            </a>
                            <span className="px-2 text-gray-400">|</span>
                            <a
                              // href="#"
                              onClick={() => {
                                deleteTicket(item.ticketId);
                              }}
                              className="cursor-pointer text-sm font-medium text-purple-600 hover:underline"
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

            {editTicket && (
              <>
                <div className="mt-4 sm:mt-4">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Ticket details
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Provide ticket details for different tiers, benefits,
                          etc.
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
                            // type="submit"
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
                          Let your guests know when your tickets sales starts
                          and ends.
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
                                        onChange={(date) =>
                                          setTicketStartDate(date)
                                        }
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
                                        onChange={(date) =>
                                          setTicketEndDate(date)
                                        }
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
                                        setTicketInvitationOnly(
                                          text.target.checked
                                        )
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
                              // type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                setEditTicket(false);
                              }}
                              className="inline-flex justify-center rounded border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:bg-purple-500"
                            >
                              Cancel
                            </button>
                            <button
                              // type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                updateTicket(ticketId);
                              }}
                              className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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

            {newTicket && (
              <>
                <form
                  onSubmit={handleSubmit((data) => {
                    createTicket();
                  })}
                >
                  <div className="mt-4 sm:mt-4">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                      <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Ticket details
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Provide ticket details for different tiers,
                            benefits, etc.
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 md:col-span-2 md:mt-0">
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
                                      // name="ticketType"
                                      value="free"
                                      id="free"
                                      className="peer hidden [&:checked_+_label_svg]:block"
                                      // checked={ticketType === "free"}
                                      // checked
                                      // onChange={(text) =>
                                      //   setTicketType(text.target.value)
                                      // }
                                      {...register("ticketType", {
                                        required: true,
                                        onChange: (e) => {
                                          setTicketType(e.target.value);
                                        },
                                      })}
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
                                      // name="ticketType"
                                      value="paid"
                                      id="paid"
                                      // checked={ticketType === "paid"}
                                      // checked
                                      {...register("ticketType", {
                                        required: true,
                                        onChange: (e) => {
                                          setTicketType(e.target.value);
                                        },
                                      })}
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
                                {errors.ticketType && (
                                  <p className="mt-2 text-sm text-rose-600">
                                    Ticket type is required.
                                  </p>
                                )}
                              </div>

                              <div className="col-span-6">
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Ticket name
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                  <input
                                    type="text"
                                    id="ticketName"
                                    {...register("ticketName", {
                                      required: true,
                                      onChange: (e) => {
                                        setTicketName(e.target.value);
                                      },
                                    })}
                                    className="block w-full flex-1 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Event name"
                                    value={ticketName}
                                  />
                                </div>
                                {errors.ticketName && (
                                  <p className="mt-2 text-sm text-rose-600">
                                    Ticket name is required.
                                  </p>
                                )}
                              </div>

                              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                <div>
                                  <label
                                    htmlFor="city"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Quantity
                                  </label>
                                  <input
                                    type="text"
                                    id="ticketQuantity"
                                    value={ticketQuantity}
                                    {...register("ticketQuantity", {
                                      required: true,
                                      onChange: (e) => {
                                        setTicketQuantity(e.target.value);
                                      },
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  />
                                </div>
                                {errors.ticketQuantity && (
                                  <p className="mt-2 text-sm text-rose-600">
                                    Ticket quantity is required.
                                  </p>
                                )}
                              </div>

                              {ticketType === "paid" && (
                                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                  <div>
                                    <label
                                      htmlFor="region"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Price
                                    </label>
                                    <input
                                      type="text"
                                      id="ticketPrice"
                                      value={ticketPrice}
                                      {...register("ticketPrice", {
                                        required: true,
                                        onChange: (e) => {
                                          setTicketPrice(e.target.value);
                                        },
                                      })}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    />
                                  </div>
                                  {errors.ticketPrice && (
                                    <p className="mt-2 text-sm text-rose-600">
                                      Ticket price is required.
                                    </p>
                                  )}
                                </div>
                              )}

                              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                <div>
                                  <label
                                    htmlFor="postal-code"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Purchase limit
                                  </label>
                                  <input
                                    type="text"
                                    id="ticketLimit"
                                    value={ticketLimit}
                                    {...register("ticketLimit", {
                                      required: true,
                                      onChange: (e) => {
                                        setTicketLimit(e.target.value);
                                      },
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  />
                                </div>
                                {errors.ticketLimit && (
                                  <p className="mt-2 text-sm text-rose-600">
                                    Ticket purchase limit is required.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
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
                            Let your guests know when your tickets sales starts
                            and ends.
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 md:col-span-2 md:mt-0">
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
                                      id="ticketDescription"
                                      {...register("ticketDescription", {
                                        // required: true,
                                        onChange: (e) => {
                                          setTicketDescription(e.target.value);
                                        },
                                      })}
                                      rows={3}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                      placeholder="Tell everyone about your event."
                                      value={ticketDescription}
                                    />
                                  </div>
                                  {errors.ticketDescription && (
                                    <p className="mt-2 text-sm text-rose-600">
                                      Ticket description is required.
                                    </p>
                                  )}
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
                                      <Controller
                                        control={control}
                                        name="ticketStartDate"
                                        rules={{ required: true }}
                                        render={({ field: { onChange } }) => (
                                          <>
                                            <DatePicker
                                              // name="start-date"
                                              placeholderText="Select sale start date"
                                              id="ticketStartDate"
                                              selected={ticketStartDate}
                                              onChange={(date) => {
                                                onChange(date);
                                                setTicketStartDate(date);
                                              }}
                                              timeInputLabel="Time:"
                                              dateFormat="MM/dd/yyyy h:mm aa"
                                              showTimeInput
                                              className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                            />
                                          </>
                                        )}
                                      />
                                    </div>
                                    {errors.ticketStartDate && (
                                      <p className="mt-2 text-sm text-rose-600">
                                        Ticket sale start date and time are
                                        required.
                                      </p>
                                    )}
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
                                      <Controller
                                        control={control}
                                        name="ticketEndDate"
                                        rules={{ required: true }}
                                        render={({ field: { onChange } }) => (
                                          <>
                                            <DatePicker
                                              // name="start-date"
                                              placeholderText="Select sale end date"
                                              id="ticketEndDate"
                                              selected={ticketEndDate}
                                              onChange={(date) => {
                                                onChange(date);
                                                setTicketEndDate(date);
                                              }}
                                              timeInputLabel="Time:"
                                              dateFormat="MM/dd/yyyy h:mm aa"
                                              showTimeInput
                                              className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                            />
                                          </>
                                        )}
                                      />
                                    </div>
                                    {errors.ticketEndDate && (
                                      <p className="mt-2 text-sm text-rose-600">
                                        Ticket sale start date and time are
                                        required.
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <div className="flex h-5 items-center">
                                    <input
                                      id="end-visible"
                                      name="end-visible"
                                      type="checkbox"
                                      checked={ticketInvitationOnly}
                                      onChange={(text) =>
                                        setTicketInvitationOnly(
                                          text.target.checked
                                        )
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
                              // type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                setNewTicket(false);
                              }}
                              className="inline-flex justify-center rounded border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:bg-purple-500"
                            >
                              Cancel
                            </button>
                            <button
                              // type="submit"
                              // onClick={(e) => {
                              //   e.preventDefault();

                              // }}
                              className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </LoadScript>
  );
}
