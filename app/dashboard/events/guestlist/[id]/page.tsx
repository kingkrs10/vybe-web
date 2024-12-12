"use client";
import ApiClient from "@/lib/axios";
import { useEffect, useState, Fragment } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
  const [scannerInstance, setScannerInstance] = useState<Html5Qrcode | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const session = await fetch(`/api/session`);
      let user = await session.json();
      const request = { pageNo: 1 };
      const response = await ApiClient(user?.token).get(
        `/guestlists/all?eventId=${params?.id}&pageNo=${request.pageNo}`
      );
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

  const startScanner = () => {
    const qrCodeRegionId = "reader";
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          console.log(`QR Code scanned: ${decodedText}`);
          setCamera(decodedText);
          stopScanner(); // Automatically stop the scanner once a QR code is scanned
        },
        (errorMessage) => {
          console.error(`Error scanning QR Code: ${errorMessage}`);
        }
      )
      .catch((err) => {
        console.error("Failed to start scanning:", err);
      });

    setScannerInstance(html5QrCode);
  };

  const stopScanner = () => {
    if (scannerInstance) {
      scannerInstance
        .stop()
        .then(() => console.log("Scanner stopped."))
        .catch((err) => console.error("Failed to stop scanning:", err));
    }
    setScan(false);
  };

  const stats = [{ name: "Total guests", stat: gueslist?.length }];

  return (
    <>
      {scan && (
        <>
          <div className="w-full items-end text-right">
            <button
              onClick={(e) => {
                e.preventDefault();
                stopScanner();
                setCamera("");
              }}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-800"
            >
              Close Scanner
            </button>
          </div>
          <div id="reader" className="mt-6 h-full w-full"></div>
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
                  startScanner();
                }}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-800"
              >
                Scan Ticket
              </button>
            </div>
            <div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-20 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
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

