import { AddServicePageClient } from "./AddServicePageClient";

// The parent layout gates this route on the authenticated vendor session.
export const instant = false;

export default function AddServiceRoute() {
  return <AddServicePageClient />;
}
