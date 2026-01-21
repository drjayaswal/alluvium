import "./globals.css";
import Navbar from "../components/app/Navbar";
import Footer from "../components/app/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiasBreaker",
  description: "AI-driven utility to ensure fair and unbiased selection",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
      >
          <GoogleOAuthProvider clientId={process.env.CLIENT_ID!}>
        <Navbar/>
        <div className="pt-15">
            {children}
        </div>
        <Footer/>
          </GoogleOAuthProvider>
      </body>
    </html>
  );
}
