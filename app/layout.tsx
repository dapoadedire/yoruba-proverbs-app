import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // Import Toaster
import { Analytics } from "@vercel/analytics/next";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Yoruba Proverbs - Discover Ancient Nigerian Wisdom",
  description:
    "Explore a collection of ancient Yoruba proverbs with translations and wisdom. Learn the rich cultural heritage of the Yoruba people through their timeless sayings.",
  keywords: [
    "yoruba proverbs",
    "nigerian proverbs",
    "african wisdom",
    "yoruba culture",
    "yoruba sayings",
    "nigerian culture",
  ],
  authors: [{ name: "Yoruba Proverbs App" }],
  creator: "Yoruba Proverbs App",
  publisher: "Yoruba Proverbs App",
  openGraph: {
    title: "Yoruba Proverbs - Ancient Wisdom for Modern Times",
    description:
      "Discover the rich cultural heritage of the Yoruba people through their timeless proverbs and sayings.",
    url: "https://yorubaproverbs.vercel.app/",
    siteName: "Yoruba Proverbs",

    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoruba Proverbs - Ancient Wisdom for Modern Times",
    description:
      "Discover the rich cultural heritage of the Yoruba people through their timeless proverbs and sayings.",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${inter.variable} ${ibmPlexSerif.variable} 
          font-sans
          antialiased min-h-full flex flex-col bg-gray-50 text-gray-900`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />

        {/* Improved Floating Feedback Button */}
        {/* <a
          href="https://forms.gle/13SAa25Da5u4gRUM7"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Request Feature or Feedback"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-2.5 bg-purple-700 text-white text-sm font-semibold rounded-full shadow-lg hover:bg-purple-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center gap-1.5 z-[9999] transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-square-plus"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" x2="15" y1="10" y2="10" />
            <line x1="12" x2="12" y1="7" y2="13" />
          </svg>
          Share Feedback
        </a> */}
        <Analytics />
      </body>
    </html>
  );
}
