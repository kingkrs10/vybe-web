import { AppStoreLink } from "@/components/AppStoreLink";
import { CircleBackground } from "@/components/CircleBackground";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export function CallToAction() {
  return (
    <section
      id="get-free-shares-today"
      className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
    >
      <div className="absolute left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="#6B21A8" className="animate-spin" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Create your first event today
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            It takes 30 seconds to sign up. <br />
            What are you waiting for?
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              href="/login"
              variant="solid"
              color="white"
              className="flex items-center px-6 align-middle"
            >
              {/* <PlayIcon className="h-6 w-6 flex-none" />
                <span className="ml-2.5">Watch the video</span> */}
              Create event
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
