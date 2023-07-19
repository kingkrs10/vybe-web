import Link from "next/link";

import { Container } from "@/components/Container";

const faqs = [
  [
    {
      question: "How can I sell tickets on your platform?",
      answer:
        "You can create your event and tickets via our web app. We support multiple ticket types, pricing options, and availability settings. After setting up, the tickets will be available for sale.",
    },
    {
      question: "How does the check-in process work?",
      answer:
        "Our platform generates unique QR codes for each ticket. At the event, you can scan these QR codes using our app to manage attendee check-ins.",
    },
    {
      question: "Is my payment information safe?",
      answer:
        "Absolutely. All payments are processed through Stripe, a trusted payment processing platform. We don't store your payment information on our servers.",
    },
  ],
  [
    {
      question: "How do I get paid for my ticket sales?",
      answer:
        "Your earnings from ticket sales are transferred directly to your bank account. The details are provided when setting up the event.",
    },
    {
      question: "Is there a limit to the number of tickets I can sell?",
      answer:
        "No, there's no limit. You can sell as many tickets as the capacity of your event allows.",
    },
    {
      question: "Can I manage multiple events at the same time?",
      answer:
        "Yes, our platform is designed to allow you to manage multiple events simultaneously.",
    },
  ],
  [
    {
      question: "What happens if a customer requests a refund?",
      answer:
        "Our platform provides an easy-to-use interface for managing refunds. You can choose to approve or deny refund requests based on your event's refund policy.",
    },
    {
      question: "Can I customize my event page?",
      answer:
        "Yes, you can fully customize your event page to match your event's theme and brand.",
    },
    {
      question: "What customer support options do you provide?",
      answer:
        "We offer round-the-clock customer support through email and live chat. Our dedicated team is always ready to assist you.",
    },
  ],
];

export function Faqs() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faqs-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            If you have anything else you want to ask,{" "}
            <Link
              href="mailto:hello@vybe.events"
              className="text-gray-900 underline"
            >
              reach out to us
            </Link>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
