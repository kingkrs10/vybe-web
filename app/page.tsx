import Image from "next/image";
import ApiClient from "@/lib/axios";
import moment from "moment";
import LandingNav from "@/components/header/landing-header";
import LandingFooter from "@/components/footer/landing-footer";
export const dynamic = "force-dynamic";

import Head from "next/head";

import { CallToAction } from "@/components/CallToAction";
import { Faqs } from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { PrimaryFeatures } from "@/components/PrimaryFeatures";
import { Reviews } from "@/components/Reviews";
import { SecondaryFeatures } from "@/components/SecondaryFeatures";
import Link from "next/link";

const getData = async () => {
  const params = { pageNo: 1 };
  const response = await ApiClient().get(
    `/events/allevents?pageNo=${params.pageNo}`
  );
  return response.data.data;
};

export default async function EventsHome() {
  const data = await getData();
  return (
    <>
      <Head>
        <title>Pocket - Invest at the perfect time.</title>
        <meta
          name="description"
          content="By leveraging insights from our network of industry insiders, you’ll know exactly when to buy to maximize profit, and exactly when to sell to avoid painful losses."
        />
      </Head>
      <Header />
      <main>
        <Hero />

        <PrimaryFeatures />
        {/* <SecondaryFeatures /> */}
        <div className="mx-auto max-w-2xl px-8 py-6 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
          <h2 className="mb-6 text-3xl">Latest events</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {data &&
              data.map((item: any, index: any) => (
                <Link
                  key={index}
                  passHref
                  href={`/${item.eventId}`}
                  className="group"
                >
                  <article className="w-full overflow-hidden rounded-lg border bg-gray-200">
                    <Image
                      alt="Office"
                      src={item.image ? item.image : "/login.jpeg"}
                      width={500}
                      height={500}
                      className="h-56 w-full object-cover"
                    />
                    <div className="bg-white p-3 sm:p-4">
                      <p className="text-xs">
                        {moment(item.startDate).format(
                          "MMMM, Do YYYY — h:mm A"
                        )}
                      </p>

                      <h3 className="mt-0.5 text-lg text-gray-900">
                        {item.name}
                      </h3>
                      <p className="line-clamp-3 mt-1 text-sm leading-relaxed text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>
        <CallToAction />
        <Reviews />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
