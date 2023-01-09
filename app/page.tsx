// "use client";
// import Image from "next/image";
import axios from "axios";
import moment from "moment";
// import { unstable_getServerSession } from "next-auth/next";
// import { authOptions } from "../pages/api/auth/[...nextauth]";
import LandingNav from "../components/header/landing";
import LandingFooter from "../components/footer/landing-footer";

async function getData() {
  // const session = await unstable_getServerSession(authOptions);

  const params = { pageNo: 1 };
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIURL}/events/allevents?pageNo=${params.pageNo}`
  );
  return response.data.data;
}

export default async function EventsHome() {
  const data = await getData();
  // console.log(data);
  return (
    <>
      <LandingNav />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-6 px-8 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {data.map((item: any, index: any) => (
              <a key={index} href={`/events/${item.eventId}`} className="group">
                <article className="w-full border overflow-hidden rounded-lg bg-gray-200">
                  <img
                    alt="Office"
                    src={item.image ? item.image : "/login.jpeg"}
                    className="h-56 w-full object-cover"
                  />
                  <div className="bg-white p-3 sm:p-4">
                    <p className="text-xs">
                      {moment(item.startDate).format("MMMM, Do YYYY")} &mdash;{" "}
                      {moment(item.startTime, "HH:mm:ss").format("h:mm A")}
                    </p>

                    <h3 className="mt-0.5 text-lg text-gray-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}

// <article className="bg-white relative" key={index}>
//   <div className="flex items-start p-6">
//     <a
//       href={`/event/${item.eventId}`}
//       className="block relative shrink-0"
//     >
//       <div className="absolute top-2 left-2">
//         <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="-ml-1 mr-1.5 h-4 w-4"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>

//           <p className="whitespace-nowrap text-sm">Draft</p>
//         </span>
//       </div>
//       <img
//         alt="Speaker"
//         src={item.image ? item.image : "/login.jpeg"}
//         className="h-24 w-48 rounded-lg object-cover"
//       />
//     </a>

//     <div className="ml-4">
//       <h3 className="font-medium sm:text-lg">
//         <a
//           href={`/event/${item.eventId}`}
//           className="hover:underline"
//         >
//           {item.name}
//         </a>
//       </h3>

//       <p className="text-sm text-gray-700 line-clamp-2">
//         {item.description}
//       </p>

//       <div className="mt-2 sm:flex sm:items-center sm:gap-2">
//         <div className="flex items-center text-gray-500">
//           {/* <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
//           />
//         </svg> */}
//           <p className="text-xs">
//             {moment(item.startDate).format("MMMM, Do YYYY")}{" "}
//             &mdash;{" "}
//             {moment(item.startTime, "HH:mm:ss").format("h:mm A")}
//           </p>
//         </div>

//         {item.address && item.city && (
//           <>
//             <span className="hidden sm:block" aria-hidden="true">
//               &middot;
//             </span>
//             <p className="text-xs">
//               {item.address}, {item.city}
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// </article>
