"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
// import { LoadScript } from "@react-google-maps/api";

export default function Proiders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>{children}</SessionProvider>
    </ErrorBoundary>
  );
}
