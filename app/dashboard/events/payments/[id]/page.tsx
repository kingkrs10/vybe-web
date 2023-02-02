export default function Tickets() {
  return (
    <div className="">
      <article className="rounded-lg border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Profit</p>

            <p className="text-2xl font-medium text-gray-900">$240.94</p>
          </div>

          <span className="rounded-full bg-purple-100 p-3 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
        </div>

        <div className="mt-1 flex gap-1 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>

          <p className="flex gap-2 text-xs">
            <span className="font-medium"> 67.81% </span>

            <span className="text-gray-500"> Since last week </span>
          </p>
        </div>
      </article>

      <section className="">
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
                    ID
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
                    Email
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
                    Amount
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
              <tr>
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
                  #00001
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  John Frusciante
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  john@rhcp.com
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  $783.23
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  <strong className="rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
                    Cancelled
                  </strong>
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

              <tr>
                <td className="sticky inset-y-0 left-0 bg-white px-4 py-2">
                  <label className="sr-only" htmlFor="Row2">
                    Row 2
                  </label>

                  <input
                    className="h-5 w-5 rounded border-gray-200"
                    type="checkbox"
                    id="Row2"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  #00002
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  George Harrison
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  george@beatles.com
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  $128.99
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  <strong className="rounded bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                    Paid
                  </strong>
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

              <tr>
                <td className="sticky inset-y-0 left-0 bg-white px-4 py-2">
                  <label className="sr-only" htmlFor="Row3">
                    Row 3
                  </label>

                  <input
                    className="h-5 w-5 rounded border-gray-200"
                    type="checkbox"
                    id="Row3"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  #00003
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  Dave Gilmour
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  dave@pinkfloyd.com
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  $459.43
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  <strong className="rounded bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700">
                    Partially Refunded
                  </strong>
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
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
