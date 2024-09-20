import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
        <GoogleOAuthProvider clientId="<your_client_id>">
          <div className="relative flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex flex-1 px-4 py-2 sm:px-8 sm:py-4 md:px-20">
              {children}
            </main>
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
