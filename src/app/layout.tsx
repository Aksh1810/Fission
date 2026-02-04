import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fission - Chain Reaction Strategy Game",
  description: "A production-grade chain reaction strategy game. Challenge the AI or play with friends!",
  keywords: ["game", "strategy", "chain reaction", "puzzle", "multiplayer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
