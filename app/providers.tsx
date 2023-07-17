"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { LoadScript } from "@react-google-maps/api";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <SessionProvider>{children}</SessionProvider>
    </ErrorBoundary>
  );
}
