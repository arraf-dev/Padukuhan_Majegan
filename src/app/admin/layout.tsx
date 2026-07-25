import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel Padukuhan", template: "%s · Panel Padukuhan" },
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-panel">{children}</div>;
}
