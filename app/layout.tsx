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
      {/* Added font-sans */}
      <body
        className={`${dmSans.variable} antialiased min-h-full flex flex-col bg-gray-50 text-gray-900`}
      >
        {children}
        <Toaster richColors position="top-right" />
        {/* Add Toaster component */}

        {/* Floating Feedback Button */}
        <a
          href="https://forms.gle/13SAa25Da5u4gRUM7"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Request Feature or Feedback"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center z-[9999]"
        >
          Request Feature or Feedback
        </a>
      </body>
    </html>
  );
}
