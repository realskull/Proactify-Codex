// app/rooms/page.tsx

export const metadata = {
  title: "Study Rooms • Proactify",
};

import RoomsClient from "./RoomsClient";

export default function RoomsPage() {
  return <RoomsClient />;
}

