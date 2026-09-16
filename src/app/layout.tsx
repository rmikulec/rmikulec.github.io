import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ryan Mikulec — Software Engineer",
  description:
    "Projects and open-source work by Ryan Mikulec. A portfolio that builds itself from .portfolio files across my GitHub repos.",
  openGraph: {
    title: "Ryan Mikulec — Software Engineer",
    description:
      "Projects and open-source work by Ryan Mikulec.",
    url: "https://rmikulec.github.io/",
    siteName: "Ryan Mikulec",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 antialiased`}
      >
        <Background />
        {children}
      </body>
    </html>
  );
}
