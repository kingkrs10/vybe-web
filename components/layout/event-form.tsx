"use client";
import React, { useEffect, useState, useRef, Fragment } from "react";
import categoryList from "@/resources/categories.json";
import countryList from "@/resources/countries-cities.json";
import timezones from "@/resources/timezones.json";
import Image from "next/image";
import {
  StandaloneSearchBox,
  LoadScript,
  useLoadScript,
} from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiClient from "@/lib/axios";
import { Transition, Listbox } from "@headlessui/react";
// import { CheckCirlce } from "@heroicons/react/solid";
import {
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EventForm({ data }: { data: any }) {
  const publishingOptions = [
    {
      name: "Published",
      description: "This job posting can be viewed by anyone who has the link.",
      current: true,
    },
    {
      name: "Draft",
      description: "This job posting will no longer be publicly accessible.",
      current: false,
    },
  ];
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [category, setCategory] = useState(data.category);
  const [type, setType] = useState(data.type);
  const [address, setAddress] = useState(data.address);
  const [country, setCountry] = useState(data.country);
  const [city, setCity] = useState(data.city);
  const [state, setState] = useState(data.state);
  const [postalCode, setPostalCode] = useState(data.postalCode);
  const [manual, setManual] = useState(data.manual);
  const [virtualUrl, setVirtualUrl] = useState(data.virtualUrl);
  const [password, setPassword] = useState(data.password);
  const [timezone, setTimezone] = useState(data.timezone);
  const [startDate, setStartDate] = useState(data.startDate);
  const [endDate, setEndDate] = useState(data.endDate);
  const [endVisible, setEndVisible] = useState(data.endVisible);
  const [mapVisible, setMapVisible] = useState(data.mapVisible);
  const [image, setImage] = useState(data.image);
  const [website, setWebsite] = useState(data.website);
  const [twitter, setTwitter] = useState(data.twitter);
  const [facebook, setFacebook] = useState(data.facebook);
  const [instagram, setInstagram] = useState(data.instagram);

  const [eventId, setEventId] = useState(data.eventId);

  const [session, setSession] = useState<any>({});

  const [show, setShow] = useState(false);
  const [active, setActive] = useState(data.isActive);

  // const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      const client = await fetch(`/api/session`);
      let user = await client.json();
      // console.log(user);
      setSession(user);
    })();
  }, []);

  useEffect(() => {
    if (show === true) {
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [show]);

  let key = country;
  let countryname = countryList[key as keyof typeof countryList];
  const lib = ["places"];

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

  const saveEvent = async () => {
    const data = {
      // eventId: eventId,
      name,
      description,
      category,
      type,
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
      isActive: true,
      lat: address?.lat,
      lng: address?.lng,
    };
    try {
      const response = await ApiClient(session?.token).patch(
        `/events/${eventId}`,
        data
      );
      // console.log(response.data.data);
      setShow(true);
      // return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const inputRef = useRef<any>();

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setAddress({
        address: place.formatted_address,
        lat: +place.geometry.location.lat(),
        lng: +place.geometry.location.lng(),
      });
    }
  };

  const publishEvent = async () => {
    const request = {
      isActive: !active,
    };
    try {
      const response = await ApiClient(session?.token).patch(
        `/events/publish/${eventId}`,
        request
      );
      if (response.data.data.eventId) {
        setActive(response.data.data.isActive);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
      libraries={["places"]}
    >
      <>
        <div className="">
          <div className="flex w-full items-end justify-end">
            {active === false ? (
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  publishEvent();
                }}
                className="group mt-4 flex justify-self-end rounded-md bg-purple-600 px-8 py-3 text-white transition focus:outline-none  sm:mt-0 sm:w-auto"
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
            ) : (
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  publishEvent();
                }}
                className="group mt-4 flex justify-self-end rounded-md bg-purple-400 px-8 py-3 text-white transition focus:outline-none sm:mt-0 sm:w-auto"
              >
                <span className="text-sm font-medium">Unpublish event</span>

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
            )}
          </div>
          {/* <div className="relative z-0">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => (
                <>
                  <Listbox.Label className="sr-only">
                    Change published status
                  </Listbox.Label>
                  <div className="relative text-right">
                    <div className="inline-flex divide-x divide-purple-600 rounded-md shadow-sm">
                      <div className="relative z-0 inline-flex divide-x divide-purple-600 rounded-md shadow-sm">
                        <div className="relative inline-flex items-center rounded-l-md border border-transparent bg-purple-500 py-2 pl-3 pr-4 text-white shadow-sm">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          <p className="ml-2.5 text-sm font-medium">
                            {selected.name}
                          </p>
                        </div>
                        <Listbox.Button className="relative inline-flex items-center rounded-l-none rounded-r-md bg-purple-500 p-2 text-sm font-medium text-white hover:bg-purple-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                          <span className="sr-only">
                            Change published status
                          </span>
                          <ChevronDownIcon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </Listbox.Button>
                      </div>
                    </div>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute left-0 mt-2 -mr-1 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:left-auto sm:right-0">
                        {publishingOptions.map((option) => (
                          <Listbox.Option
                            key={option.name}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-purple-500 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none p-4 text-sm"
                              )
                            }
                            value={option}
                          >
                            {({ selected, active }) => (
                              <div className="flex flex-col">
                                <div className="flex justify-between">
                                  <p
                                    className={
                                      selected ? "font-semibold" : "font-normal"
                                    }
                                  >
                                    {option.name}
                                  </p>
                                  {selected ? (
                                    <span
                                      className={
                                        active
                                          ? "text-white"
                                          : "text-purple-500"
                                      }
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </div>
                                <p
                                  className={classNames(
                                    active
                                      ? "text-purple-200"
                                      : "text-gray-500",
                                    "mt-2 text-right"
                                  )}
                                >
                                  {option.description}
                                </p>
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div> */}
          <>
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
                  <form action="#" method="POST">
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
                              onChange={(text) => setName(text.target.value)}
                              name="name"
                              id="name"
                              className="block w-full flex-1 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              placeholder="Event name"
                              defaultValue={name}
                            />
                          </div>
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
                              name="description"
                              onChange={(text) =>
                                setDescription(text.target.value)
                              }
                              rows={3}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              placeholder="Tell everyone about your event."
                              defaultValue={description}
                            />
                          </div>
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
                            name="category"
                            defaultValue={category}
                            onChange={(text) => setCategory(text.target.value)}
                            autoComplete="category"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                          >
                            {Object.keys(categoryList)
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
                      Location
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Provide venue tips to enable everyone find your event
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <form action="#" method="POST">
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6">
                            <fieldset className="grid grid-cols-2 gap-4">
                              <legend className="sr-only">Delivery</legend>

                              <div className="">
                                <input
                                  type="radio"
                                  name="type"
                                  value="live"
                                  id="live"
                                  className="peer hidden [&:checked_+_label_svg]:block"
                                  checked={type === "live"}
                                  onChange={(text) => {
                                    setType(text.target.value);
                                  }}
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
                                  name="type"
                                  value="virtual"
                                  id="virtual"
                                  checked={type === "virtual"}
                                  onChange={(text) => {
                                    setType(text.target.value);
                                    setManual(false);
                                  }}
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
                                    defaultValue={virtualUrl}
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
                                    defaultValue={password}
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
                                    defaultValue={address}
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
                                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                                    >
                                      {Object.keys(countryList)
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
                                      defaultValue={address.address}
                                      onChange={(text) =>
                                        setAddress(text.target.value)
                                      }
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
                                      defaultValue={city}
                                      onChange={(text) =>
                                        setCity(text.target.value)
                                      }
                                      autoComplete="country-name"
                                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                                    >
                                      {countryname?.sort().map((key, index) => {
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
                                      defaultValue={state}
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
                                      defaultValue={postalCode}
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
                      Date and Time
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Let your guests know when your event starts and ends.
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <form action="#" method="POST">
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
                                defaultValue={timezone}
                                onChange={(text) =>
                                  setTimezone(text.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                              >
                                {timezones
                                  .sort((a: any, b: any) => a.name - b.name)
                                  .map((key, index) => {
                                    return (
                                      <option key={index} value={key.text}>
                                        {key.text}
                                      </option>
                                    );
                                  })}
                              </select>
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
                                  <DatePicker
                                    name="start-date"
                                    id="start-date"
                                    selected={new Date(startDate)}
                                    onChange={(date: any) => setStartDate(date)}
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
                                  <DatePicker
                                    name="end-date"
                                    id="end-date"
                                    selected={new Date(endDate)}
                                    onChange={(date: any) => setEndDate(date)}
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    showTimeInput
                                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* <div className="grid grid-cols-6 gap-6">
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
                                <input
                                  type="text"
                                  name="end-date"
                                  id="end-date"
                                  value={endDate}
                                  onChange={(text) =>
                                    setEndDate(text.target.value)
                                  }
                                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  placeholder="01/01/2024"
                                />
                              </div>
                            </div>

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
                                  value={endTime}
                                  onChange={(text) =>
                                    setEndTime(text.target.value)
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
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
          {/* )} */}

          {/* This is where we will have the upload section */}
          {/* {step === 2 && ( */}
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
                          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                              {image != "" && (
                                <div className="relative">
                                  <div className="absolute top-0 right-0 flex h-7 w-7 justify-center rounded-bl-md bg-white">
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
                                    height={500}
                                    width={500}
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
                              defaultValue={website}
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
                              defaultValue={twitter}
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
                              defaultValue={facebook}
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
                              defaultValue={instagram}
                              name="instagram"
                              id="instagram"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-4">
                        <button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            saveEvent();
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
        </div>
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
                        Successfully saved!
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
    </LoadScript>
  );
}
