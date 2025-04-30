"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Copy, Share2, Heart, Download } from "lucide-react";

interface Proverb {
  id: number;
  proverb: string;
  translation: string;
  wisdom: string; // Changed from 'explanation' to 'wisdom' to match the API response
}

export default function Home() {
  const [proverb, setProverb] = useState<Proverb | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<Proverb[]>([]);
  const proverbCardRef = useRef<HTMLDivElement>(null);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteProverbs");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Update localStorage when favorites change
  useEffect(() => {
    localStorage.setItem("favoriteProverbs", JSON.stringify(favorites));
  }, [favorites]);

  const fetchProverb = useCallback(async () => {
    // Keep existing loading logic
    if (initialLoad) {
      setLoading(true);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/proverb`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Proverb = await response.json();
      setProverb(data);
    } catch (error) {
      console.error("Error fetching proverb:", error);
      toast.error("Failed to fetch proverb.");
    } finally {
      setLoading(false);
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  }, [initialLoad]);

  useEffect(() => {
    fetchProverb();
  }, [fetchProverb]);

  const copyToClipboard = () => {
    if (!proverb) return;
    const textToCopy = `Proverb: ${proverb.proverb}\nTranslation: ${proverb.translation}\nWisdom: ${proverb.wisdom}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Proverb copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy proverb.");
      });
  };

  const shareAsImage = useCallback(async () => {
    if (!proverbCardRef.current) {
      toast.error("Could not capture proverb card.");
      return;
    }

    try {
      // Temporarily add a class for styling the captured image (e.g., white background)
      proverbCardRef.current.classList.add("bg-white", "p-6"); // Ensure background for image

      const dataUrl = await toPng(proverbCardRef.current, { cacheBust: true });

      // Remove the temporary class
      proverbCardRef.current.classList.remove("bg-white", "p-6");

      const link = document.createElement("a");
      link.download = `yoruba-proverb-${proverb?.id || "image"}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Proverb image downloaded!");

      // Optional: Direct share using Web Share API (if supported)
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], link.download, { type: blob.type });
        try {
          await navigator.share({
            title: "Yoruba Proverb",
            text: `${proverb?.proverb}`,
            files: [file],
          });
          toast.info("Shared successfully!");
        } catch (error) {
          // Handle share cancellation or error, but download already happened
          console.log(
            "Sharing cancelled or failed, but image downloaded.",
            error
          );
        }
      }
    } catch (err) {
      // Remove the temporary class in case of error
      if (proverbCardRef.current) {
        proverbCardRef.current.classList.remove("bg-white", "p-6");
      }
      console.error("Failed to generate image:", err);
      toast.error("Failed to generate image.");
    }
  }, [proverb]);

  const isFavorite = (id: number | undefined): boolean => {
    if (id === undefined) return false;
    return favorites.some((fav) => fav.id === id);
  };

  const toggleFavorite = () => {
    if (!proverb) return;

    if (isFavorite(proverb.id)) {
      // Remove from favorites
      setFavorites(favorites.filter((fav) => fav.id !== proverb.id));
      toast.info("Removed from favorites.");
    } else {
      // Add to favorites
      setFavorites([...favorites, proverb]);
      toast.success("Added to favorites!");
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-800">
          Yoruba Proverbs
        </h1>
        <p className="text-lg text-gray-600">Ancient wisdom in modern times</p>
        {/* Link to Favorites Page - Implement this page separately */}
        <a
          href="/favorites"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          View Favorites ({favorites.length})
        </a>
      </header>

      <section
        ref={proverbCardRef} // Add ref here
        className={`border border-gray-200 bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 w-full transition-opacity duration-300 ${
          initialLoad && loading ? "opacity-50 animate-pulse" : "opacity-100"
        }`}
        style={{ minHeight: "250px" }} // Ensure minimum height during loading
      >
        {initialLoad && loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-center text-gray-500">Loading proverb...</p>
          </div>
        ) : proverb ? (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 leading-tight">
              {proverb.proverb}
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              <strong className="font-medium">Translation:</strong>{" "}
              {proverb.translation}
            </p>
            <p className="text-gray-600">
              <strong className="font-medium">Wisdom:</strong> {proverb.wisdom}
            </p>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-center text-red-500">Could not load proverb.</p>
          </div>
        )}
      </section>

      {/* Action Buttons - Only show if proverb loaded */}
      {!loading && proverb && (
        <div className="flex space-x-3 mb-8">
          <button
            onClick={copyToClipboard}
            title="Copy to Clipboard"
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={shareAsImage}
            title="Download as Image"
            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200 shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            <Download size={20} />
          </button>
          <button
            onClick={toggleFavorite}
            title={
              isFavorite(proverb?.id)
                ? "Remove from Favorites"
                : "Add to Favorites"
            }
            className={`p-3 rounded-full transition duration-200 shadow focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
              isFavorite(proverb?.id)
                ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
            }`}
          >
            <Heart
              size={20}
              fill={isFavorite(proverb?.id) ? "currentColor" : "none"}
            />
          </button>
          {/* Basic Share Button - Enhance with specific platforms if needed */}
          <button
            onClick={() => {
              if (navigator.share && proverb) {
                navigator
                  .share({
                    title: "Yoruba Proverb",
                    text: `Check out this Yoruba proverb: ${proverb.proverb}`,
                    url: window.location.href, // Share the current page URL
                  })
                  .catch((error) => console.log("Error sharing", error));
              } else {
                toast.info(
                  "Web Share API not supported in your browser, or no proverb loaded."
                );
              }
            }}
            title="Share"
            className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-200 shadow focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
          >
            <Share2 size={20} />
          </button>
        </div>
      )}

      <button
        onClick={fetchProverb} // Using direct reference to the function
        disabled={loading && !initialLoad} // Disable button during subsequent loads if needed
        className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition duration-200 shadow focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && !initialLoad ? "Loading..." : "Get Another Proverb"}
      </button>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Yoruba Proverbs App. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
