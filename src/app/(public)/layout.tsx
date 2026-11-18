import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <><Navbar /><main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">{children}</main><Footer /></>;
}
