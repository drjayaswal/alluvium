import "./globals.css";
import Navbar from "../components/app/Navbar";
import Footer from "../components/app/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import AuthGuard from "@/components/app/AuthGurad";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BiasBreaker",
  description: "AI-driven utility to ensure fair and unbiased selection",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}>
        <Toaster position="bottom-right" closeButton richColors className="bg-main/05" />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthGuard>
            <Navbar />
            <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden">{children}</div>
            <Footer />
          </AuthGuard>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}