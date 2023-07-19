"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { Container } from "@/components/Container";

const reviews = [
  {
    title: "Superb Experience",
    body: "VYBE transformed our annual conference. The web app is intuitive and comprehensive. Made planning seamless.",
    author: "Alexandra S.",
    rating: 5,
  },
  {
    title: "Effortless Wedding Planning",
    body: "VYBE was a lifesaver for my wedding. All tools needed in one place, made the process effortless.",
    author: "Jenny M.",
    rating: 5,
  },
  {
    title: "User-friendly and Efficient",
    body: "VYBE has been instrumental for our organization's events. Their platform never disappoints.",
    author: "Thomas R.",
    rating: 5,
  },
  {
    title: "Best Event Platform",
    body: "VYBE is the best event platform. The web app is brilliant and makes event planning a piece of cake.",
    author: "Nancy D.",
    rating: 5,
  },
  {
    title: "Outstanding Service",
    body: "VYBE streamlined our product launch and ensured a successful event.",
    author: "Martin P.",
    rating: 5,
  },
  {
    title: "Exceptional Platform",
    body: "VYBE was key to our charity fundraiser's success. Their web app is a must-have.",
    author: "Sophia L.",
    rating: 5,
  },
  {
    title: "Hassle-free Corporate Event",
    body: "VYBE nailed it with their web app. Managing our corporate event became hassle-free.",
    author: "George H.",
    rating: 5,
  },
  {
    title: "Stress-free Party Planning",
    body: "Amazing experience with VYBE for our private party. Their web app made event planning stress-free.",
    author: "Emily K.",
    rating: 5,
  },
  {
    title: "Conference Game Changer",
    body: "VYBE' web app is a game changer. Our conference was well-executed and memorable, thanks to them.",
    author: "Carlos V.",
    rating: 5,
  },
  {
    title: "Innovative and Effective",
    body: "The VYBE web app turned our annual gala into a sensation. The features are innovative and highly effective.",
    author: "Olivia N.",
    rating: 5,
  },
  {
    title: "Easy and Efficient",
    body: "VYBE made planning our business seminar a breeze. The web app is easy to use and highly efficient.",
    author: "James T.",
    rating: 5,
  },
  {
    title: "Perfect for Product Launches",
    body: "Used VYBE for our new product launch. Their web app made the process so much simpler and efficient.",
    author: "Matthew L.",
    rating: 5,
  },
  {
    title: "Great for Large Conferences",
    body: "Organizing a large conference was never easier, thanks to VYBE. Their web app is a lifesaver.",
    author: "Sarah P.",
    rating: 5,
  },
  {
    title: "Ideal for Social Gatherings",
    body: "Used VYBE for a social gathering. The web app helped us plan every detail flawlessly.",
    author: "Emma J.",
    rating: 5,
  },
];

function StarIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex">
      {[...Array(5).keys()].map((index) => (
        <StarIcon
          key={index}
          className={clsx(
            "h-5 w-5",
            rating > index ? "fill-purple-500" : "fill-gray-300"
          )}
        />
      ))}
    </div>
  );
}

function Review({ title, body, author, rating, className, ...props }) {
  let animationDelay = useMemo(() => {
    let possibleAnimationDelays = [
      "0s",
      "0.1s",
      "0.2s",
      "0.3s",
      "0.4s",
      "0.5s",
    ];
    return possibleAnimationDelays[
      Math.floor(Math.random() * possibleAnimationDelays.length)
    ];
  }, []);

  return (
    <figure
      className={clsx(
        "animate-fade-in rounded-3xl bg-white p-6 shadow-md shadow-gray-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <blockquote className="text-gray-900">
        <StarRating rating={rating} />
        <p className="mt-4 text-lg font-semibold leading-6 before:content-['“'] after:content-['”']">
          {title}
        </p>
        <p className="mt-3 text-base leading-7">{body}</p>
      </blockquote>
      <figcaption className="mt-3 text-sm text-gray-600 before:content-['–_']">
        {author}
      </figcaption>
    </figure>
  );
}

function splitArray(array, numParts) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }
  return result;
}

function ReviewColumn({
  className,
  reviews,
  reviewClassName = () => {},
  msPerPixel = 0,
}) {
  let columnRef = useRef();
  let [columnHeight, setColumnHeight] = useState(0);
  let duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    let resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current.offsetHeight);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={clsx("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration }}
    >
      {reviews.concat(reviews).map((review, reviewIndex) => (
        <Review
          key={reviewIndex}
          aria-hidden={reviewIndex >= reviews.length}
          className={reviewClassName(reviewIndex % reviews.length)}
          {...review}
        />
      ))}
    </div>
  );
}

function ReviewGrid() {
  let containerRef = useRef();
  let isInView = useInView(containerRef, { once: true, amount: 0.4 });
  let columns = splitArray(reviews, 3);
  columns = [columns[0], columns[1], splitArray(columns[2], 2)];

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView && (
        <>
          <ReviewColumn
            reviews={[...columns[0], ...columns[2].flat(), ...columns[1]]}
            reviewClassName={(reviewIndex) =>
              clsx(
                reviewIndex >= columns[0].length + columns[2][0].length &&
                  "md:hidden",
                reviewIndex >= columns[0].length && "lg:hidden"
              )
            }
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...columns[1], ...columns[2][1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= columns[1].length && "lg:hidden"
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={columns[2].flat()}
            className="hidden lg:block"
            msPerPixel={10}
          />
        </>
      )}
      {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50" /> */}
    </div>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="pb-16 pt-20 sm:pb-24 sm:pt-32"
    >
      <Container>
        <h2
          id="reviews-title"
          className="text-3xl font-medium tracking-tight text-gray-900 sm:text-center"
        >
          Everyone is changing their life with Pocket.
        </h2>
        <p className="mt-2 text-lg text-gray-600 sm:text-center">
          Thousands of people have doubled their net-worth in the last 30 days.
        </p>
        <ReviewGrid />
      </Container>
    </section>
  );
}
