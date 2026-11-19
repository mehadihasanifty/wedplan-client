"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="light"
      richColors
      closeButton
      duration={4500}
    />
  );
}
