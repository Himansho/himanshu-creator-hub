import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: {
    default: "Himanshu Bartwal — Creator",
    template: "%s — Himanshu Bartwal",
  },
  description:
    "I build things which solve real problems. Apps, experiments, and ideas — all in one place.",
  openGraph: {
    title: "Himanshu Bartwal — Creator",
    description:
      "I build things which solve real problems. Apps, experiments, and ideas — all in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={kanit.variable}>
      <body className="bg-base text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
