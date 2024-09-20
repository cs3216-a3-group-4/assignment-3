import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import Navbar from "@/components/navigation/navbar";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  // TODO: change these
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "CS3216 Assignment 3 (Group 4) - placeholder",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="w-full flex flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
