import ApiClient from "@/lib/axios";
import moment from "moment";
import Image from "next/image";

// export const dynamic = "force-static";

const getData = async (eventId: any) => {
  const response = await ApiClient().get(`/events/${eventId}`);
  // console.log(response.data.data);
  return response.data.data;
};

export default async function Overview({
  params: { id },
}: {
  params: { id: any };
}) {
  const data = await getData(id);
  return (
    <div className="">
      <section className="mt-4 rounded-lg border-2 border-gray-100 bg-white">
        <div className="mx-auto max-w-screen-xl py-4 px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:h-full">
              <Image
                alt="Party"
                src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                className="absolute inset-0 h-full w-full object-cover"
                height={500}
                priority
                width={500}
              />
            </div>

            <div className="lg:py-24">
              <h2 className="text-3xl font-bold sm:text-4xl">{data.name}</h2>

              <p className="mt-4 text-gray-600">{data.description}</p>
              <p className="mt-4 text-gray-600">{data.address}</p>
              {/* <p className="text-gray-600">
                {data.city}, {data.country}
              </p> */}
              <p className="mt-4 text-gray-600">
                {moment(data.startDate).format("MMMM, Do YYYY")} &mdash;{" "}
                {moment(data.startTime, "HH:mm:ss").format("h:mm A")}
              </p>

              {/* <a
                href="#"
                className="mt-8 inline-flex items-center rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              >
                <span className="text-sm font-medium"> Get Started </span>

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
              </a> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
