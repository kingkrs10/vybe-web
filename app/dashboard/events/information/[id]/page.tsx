import React from "react";
import axios from "axios";
import EventForm from "@/components/layout/event-form";

async function getData(eventId: any) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIURL}/events/${eventId}`
  );
  return response.data.data;
}

export default async function Information({ params }: { params: any }) {
  const data = await getData(params.id);
  return <EventForm data={data} />;
}
