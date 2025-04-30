import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // Import Toaster

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Yoruba Proverbs",
  description: "Discover the wisdom of Yoruba proverbs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full font-sans">
      {" "}
      {/* Added font-sans */}
      <body
        className={`${dmSans.variable} antialiased min-h-full flex flex-col bg-gray-50 text-gray-900`}
      >
        {children}
        <Toaster richColors position="top-right" />{" "}
        {/* Add Toaster component */}
      </body>
    </html>
  );
}
