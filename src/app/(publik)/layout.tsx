import { Footer, Header, NavBawah } from "@/components/situs";

export default function LayoutPublik({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* pb-24 memberi ruang untuk navigasi bawah di mobile */}
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
      <NavBawah />
    </>
  );
}
