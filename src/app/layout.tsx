import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ZustandProvider } from "@/components/providers/ZustandProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tâm An Chatbot - Mental Health Support",
  description: "A calm, supportive mental health support chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ZustandProvider>{children}</ZustandProvider>
      </body>
    </html>
  );
}
