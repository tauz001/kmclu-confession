import type { Metadata, Viewport } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import WallPosters from "@/components/wall/WallPosters";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#141722",
};

export const metadata: Metadata = {
  title: "KMCLU Confession Wall — Say It. Leave It. Let It Float.",
  description:
    "An anonymous confession wall for KMCLU students. Share your campus secrets, regrets, crushes, and unspoken thoughts freely and anonymously on the painted wall.",
  keywords: [
    "KMCLU",
    "Confession Wall",
    "Anonymous",
    "College",
    "KMCLU Confessions",
    "Lucknow",
    "Student Wall",
  ],
  authors: [{ name: "KMCLU Community" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#141722] text-amber-50 font-sans selection:bg-[#bef264] selection:text-black wall-painted-texture relative overflow-x-hidden">
        {/* Plaster & paint roller stipple texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none wall-paint-stipple z-0 opacity-45"
          aria-hidden="true"
        />

        {/* Funky Street Art & Gig Posters Pasted on the Wall */}
        <WallPosters />

        {/* Page Content */}
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
