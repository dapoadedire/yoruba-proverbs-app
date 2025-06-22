"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Copy,
  Share2,
  Heart,
  Download,
  RefreshCw,
  BookOpen,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import ProverbImageCard from "../components/ProverbImageCard";
import { useProverbManager } from "../hooks/useProverbManager";
import { copyToClipboard } from "../utils/clipboard";
import { shareAsImage } from "../utils/sharing";
import SubscriptionForm from "../components/SubscriptionForm";

export default function Home() {
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const proverbCardRef = useRef<HTMLDivElement>(null);
  const downloadCardRef = useRef<HTMLDivElement>(null);

  // Use our custom hook for proverb management
  const {
    proverb,
    isLoading: loading,
    error,
    fetchNewProverb,
    favorites,
    isFavorite,
    toggleFavorite,
  } = useProverbManager();

  // Effect for handling initial load state
  useEffect(() => {
    if (!loading && initialLoad) {
      setInitialLoad(false);
    }
  }, [loading, initialLoad]);

  // Helper function to handle copy to clipboard
  const handleCopyToClipboard = () => {
    if (!proverb) return;
    const textToCopy = `Proverb: ${proverb.proverb}\nTranslation: ${proverb.translation}\nWisdom: ${proverb.wisdom}`;
    copyToClipboard(textToCopy, "Proverb copied to clipboard!");
  };

  // Helper function to handle sharing as image
  const handleShareAsImage = () => {
    if (!proverb || !downloadCardRef.current) return;

    shareAsImage({
      element: downloadCardRef.current,
      fileName: `yoruba-proverb-${proverb.id || "image"}.png`,
      title: "Yoruba Proverb",
      text: proverb.proverb,
    });
  };

  return (
    <main className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hidden download card - only used for image generation */}
      <div className="fixed left-[-9999px]" aria-hidden="true">
        <div ref={downloadCardRef}>
          {proverb && <ProverbImageCard proverb={proverb} />}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="container mx-auto px-4 pt-10 max-w-5xl">
          <header className="text-center mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-amber-900 leading-tight">
              Yoruba Proverbs
            </h1>
            <p
              className="text-xl text-amber-800 max-w-2xl mx-auto
            text-balance
            "
            >
              Discover ancient wisdom in modern times — a daily dose of cultural
              insight and knowledge
            </p>

            {/* Favorites Quick Access */}
            <Link
              href="/favorites"
              className="mt-6 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              <BookOpen size={18} />
              Your Collection ({favorites.length})
            </Link>
          </header>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center">
          {/* Proverb Card with Improved Design */}
          <div
            className="w-full max-w-2xl mb-12 perspective-1000 transform transition-all"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={proverbCardRef}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform ${
                loading ? "opacity-50" : "opacity-100"
              }`}
              style={{ minHeight: "300px", transformStyle: "preserve-3d" }}
            >
              {/* Card Top Decorative Element */}
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>

              {/* Card Content */}
              <div className="p-5 md:p-10">
                {loading ? (
                  <div className="flex flex-col justify-center items-center h-48 space-y-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-center text-gray-500 font-medium">
                      Loading wisdom...
                    </p>
                  </div>
                ) : proverb ? (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 leading-snug">
                        {proverb.proverb}
                      </h2>
                      <p className="text-lg text-gray-700 mb-4 border-l-4 border-amber-300 pl-3">
                        <span className="font-medium text-amber-700 block mb-1">
                          Translation:
                        </span>
                        {proverb.translation}
                      </p>
                      <p className="text-gray-600 border-l-4 border-gray-200 pl-3">
                        <span className="font-medium text-gray-700 block mb-1">
                          Wisdom:
                        </span>
                        {proverb.wisdom}
                      </p>
                    </div>

                    {/* Action Buttons - Moved inside the card */}
                    <div className="flex flex-wrap justify-center gap-3 border-t border-gray-100 pt-6">
                      <button
                        onClick={handleCopyToClipboard}
                        title="Copy to Clipboard"
                        className=" cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      >
                        <Copy size={16} />
                        <span className="hidden sm:inline">Copy</span>
                      </button>
                      <button
                        onClick={handleShareAsImage}
                        title="Download as Image"
                        className=" cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button
                        onClick={toggleFavorite}
                        title={
                          isFavorite(proverb?.id)
                            ? "Remove from Favorites"
                            : "Add to Favorites"
                        }
                        className={` cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                          isFavorite(proverb?.id)
                            ? "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-400"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400"
                        }`}
                      >
                        <Heart
                          size={16}
                          fill={
                            isFavorite(proverb?.id) ? "currentColor" : "none"
                          }
                        />
                        <span className="hidden sm:inline">
                          {isFavorite(proverb?.id) ? "Favorited" : "Favorite"}
                        </span>
                      </button>
                      {/* Web Share API */}
                      {navigator.share && (
                        <button
                          onClick={() => {
                            if (navigator.share && proverb) {
                              navigator
                                .share({
                                  title: "Yoruba Proverb",
                                  text: `Check out this Yoruba proverb: ${proverb.proverb}`,
                                  url: window.location.href,
                                })
                                .catch((error) =>
                                  console.log("Error sharing", error)
                                );
                            } else {
                              toast.info(
                                "Web Share API not supported in your browser, or no proverb loaded."
                              );
                            }
                          }}
                          title="Share"
                          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                        >
                          <Share2 size={16} />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      )}

                      {/* Twitter Share Button */}
                      {proverb && (
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            `Check out this Yoruba proverb: "${proverb.proverb}" from Yoruba Proverbs App`
                          )}&url=${encodeURIComponent(
                            `${window.location.origin}/${proverb.id}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share on Twitter"
                          className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full hover:bg-sky-200 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
                        >
                          <Twitter size={16} />
                          <span className="hidden sm:inline">Tweet</span>
                        </a>
                      )}
                    </div>
                  </>
                ) : error ? (
                  <div className="flex justify-center items-center h-48">
                    <p className="text-center text-red-500 font-medium">
                      Could not load proverb. Please try again.
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-48">
                    <p className="text-center text-gray-500 font-medium">
                      No proverb found. Click &quot;Discover New Proverb&quot;
                      below.
                    </p>
                  </div>
                )}
              </div>

              {/* Source indicator */}
              {proverb && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                  Proverb #{proverb.id}
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA - Discover New Proverb */}
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={fetchNewProverb}
              disabled={loading}
              className="
              cursor-pointer
              flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-lg rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              {loading ? "Finding wisdom..." : "Discover New Proverb"}
            </button>

            <div className="text-center">
              <Link
                href="/favorites"
                className="text-amber-700 hover:text-amber-800 font-medium underline-offset-4 hover:underline"
              >
                Browse your favorite proverbs
              </Link>
            </div>
          </div>
        </div>

         {/* Subscription Section */}
        <div className="mt-12 mb-12 max-w-md mx-auto">
          <SubscriptionForm />
        </div>

        {/* Educational Section */}
        <div className="mt-20 mb-8 max-w-2xl mx-auto bg-amber-50 rounded-xl p-6 border border-amber-100">
          <h2 className="font-bold text-xl text-amber-900 mb-3">
            About Yoruba Proverbs
          </h2>
          <p className="text-amber-800 mb-2">
            Yoruba proverbs, known as &quot;Òwe&quot; in the Yoruba language,
            are an essential part of Yoruba culture and communication in Nigeria
            and across West Africa.
          </p>
          <p className="text-amber-700">
            These proverbs reflect the collective wisdom, philosophy, and
            cultural values of the Yoruba people, passed down through
            generations.
          </p>
        </div>

       

        <footer className="text-center text-gray-500 text-sm mt-10">
          <p>
            &copy; {new Date().getFullYear()} Yoruba Proverbs App. All rights
            reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
