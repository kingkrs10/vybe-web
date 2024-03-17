import LandingNav from "@/components/header/landing-header";
import LandingContent from "@/components/layout/landing-content-main";
import LandingFooter from "@/components/footer/landing-footer";
import { getCurrentUser } from "@/lib/session";
import ApiClient from "@/lib/axios";

export default async function EventPage({ params }: { params: any }) {
  const session = await getCurrentUser();
  const event = await ApiClient(null).get(`/events/${params.id}`);
  const tickets = await ApiClient(null).get(
    `/tickets/all?eventId=${params.id}&pageNo=${1}`
  );

  return (
    <div className="">
      <LandingNav session={session} />
      <div className="min-h-full bg-gray-50 pb-4">
        <LandingContent
          event={event.data.data}
          tickets={tickets.data.data}
          session={session}
        />
        <LandingFooter />
      </div>
    </div>
  );
}
