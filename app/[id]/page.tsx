import LandingNav from "@/components/header/landing-header";
import LandingContent from "@/components/layout/landing-content-main";
import LandingFooter from "@/components/footer/landing-footer";
import { getCurrentUser } from "@/lib/session";

export default async function EventPage({ params }: { params: any }) {
  const session = await getCurrentUser();
  return (
    <div className="">
      <LandingNav />
      <div className="min-h-full pb-4 bg-gray-50">
        <LandingContent id={params.id} session={session} />
        <LandingFooter />
      </div>
    </div>
  );
}
