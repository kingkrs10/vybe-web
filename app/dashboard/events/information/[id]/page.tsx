import React from "react";
import ApiClient from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import EventForm from "@/components/layout/event-form";

async function getData(eventId: any) {
  try {
    const response = await ApiClient().get(`/events/${eventId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}

export default async function Information({ params }: { params: any }) {
  const data = await getData(params.id);
  return <EventForm data={data} />;
}
