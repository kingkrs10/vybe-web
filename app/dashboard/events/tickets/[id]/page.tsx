import axios from "axios";
import moment from "moment";

// import { unstable_getServerSession } from "next-auth/next";
// import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";

async function getData(eventId: any) {
  const params = { eventId: eventId, pageNo: 1 };
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIURL}/tickets/all?eventId=${params.eventId}&pageNo=${params.pageNo}`
  );
  return response.data.data;
}

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

export default async function Tickets({ params }: { params: any }) {
  const data = await getData(params.id);
  return (
    <div className="w-3/4">
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
              {data.map((item: any) => (
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
      </section>
    </div>
  );
}
