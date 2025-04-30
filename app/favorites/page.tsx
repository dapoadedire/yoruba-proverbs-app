"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Copy, ArrowLeft, Trash2, Download, Heart } from "lucide-react";
import Link from "next/link";

interface Proverb {
  id: number;
  proverb: string;
  translation: string;
  wisdom: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Proverb[]>([]);
  const [selectedProverb, setSelectedProverb] = useState<Proverb | null>(null);
  const proverbCardRef = useRef<HTMLDivElement>(null);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favoriteProverbs");
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        console.log("Favorites page loading from localStorage:", parsedFavorites.length, "items");
        
        // Always set the favorites from localStorage
        setFavorites(parsedFavorites);
        
        // Select first proverb if available and no proverb is currently selected
        if (parsedFavorites.length > 0 && !selectedProverb) {
          setSelectedProverb(parsedFavorites[0]);
        }
      } else {
        console.log("No favorites found in localStorage");
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      toast.error("Failed to load your favorites");
    }
  // Only run this effect once on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle selection of proverb when favorites change
  useEffect(() => {
    // If the selected proverb is removed, select another one or set to null
    if (
      selectedProverb &&
      !favorites.some((fav) => fav.id === selectedProverb.id)
    ) {
      setSelectedProverb(favorites.length > 0 ? favorites[0] : null);
    }
  }, [favorites, selectedProverb]);

  const removeFromFavorites = (id: number) => {
    const updatedFavorites = favorites.filter((proverb) => proverb.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteProverbs", JSON.stringify(updatedFavorites));
    toast.success("Removed from favorites");
  };

  const copyToClipboard = () => {
    if (!selectedProverb) return;
    const textToCopy = `Proverb: ${selectedProverb.proverb}\nTranslation: ${selectedProverb.translation}\nWisdom: ${selectedProverb.wisdom}`;
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
    if (!proverbCardRef.current || !selectedProverb) {
      toast.error("No proverb selected to share.");
      return;
    }

    try {
      // Temporarily add a class for styling the captured image
      proverbCardRef.current.classList.add("bg-white", "p-6");

      // Store original styles to restore them later
      const originalStyles = {
        width: proverbCardRef.current.style.width,
        height: proverbCardRef.current.style.height,
        maxWidth: proverbCardRef.current.style.maxWidth,
      };

      // Set fixed dimensions for the image export - 1080x1350 aspect ratio
      proverbCardRef.current.style.width = "400px";
      proverbCardRef.current.style.height = "400px";
      proverbCardRef.current.style.maxWidth = "none";

      // Generate the image with the fixed dimensions
      const dataUrl = await toPng(proverbCardRef.current, {
        cacheBust: true,
        pixelRatio: 1, // Use exact pixel ratio to maintain dimensions
        width: 400,
        height: 400,
      });

      // Restore original styles
      proverbCardRef.current.style.width = originalStyles.width;
      proverbCardRef.current.style.height = originalStyles.height;
      proverbCardRef.current.style.maxWidth = originalStyles.maxWidth;

      // Remove the temporary class
      proverbCardRef.current.classList.remove("bg-white", "p-6");

      const link = document.createElement("a");
      link.download = `yoruba-proverb-${selectedProverb?.id || "image"}.png`;
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
            text: `${selectedProverb?.proverb}`,
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
        // Reset styles in case of error
        proverbCardRef.current.style.width = "";
        proverbCardRef.current.style.height = "";
        proverbCardRef.current.style.maxWidth = "";
      }
      console.error("Failed to generate image:", err);
      toast.error("Failed to generate image.");
    }
  }, [selectedProverb]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <header className="flex flex-col items-center">
            <Link
              href="/"
              className="self-start flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors mb-6"
            >
              <ArrowLeft size={18} className="mr-1" /> Back to Discover
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-amber-900 leading-tight text-center">
              Your Favorite Proverbs
            </h1>
            <p className="text-lg text-amber-800 max-w-2xl mx-auto text-center">
              Your personal collection of Yoruba wisdom
            </p>
          </header>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
            <div className="mb-6">
              <Heart size={64} className="mx-auto text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Your collection is empty
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              You haven&apos;t added any favorite proverbs yet.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors shadow-md"
            >
              Discover Proverbs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar with all favorites */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 h-fit max-h-[600px] overflow-y-auto sticky top-4">
                <h2 className="text-lg font-bold mb-4 text-amber-800 border-b border-amber-100 pb-2">
                  Your Collection ({favorites.length})
                </h2>
                <ul className="space-y-3">
                  {favorites.map((proverb) => (
                    <li
                      key={proverb.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-amber-50 ${
                        selectedProverb?.id === proverb.id
                          ? "bg-amber-50 border-l-4 border-amber-500"
                          : ""
                      }`}
                      onClick={() => setSelectedProverb(proverb)}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-800 line-clamp-2">
                          {proverb.proverb}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorites(proverb.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove from favorites"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {proverb.translation}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selected Proverb Detail View */}
            <div className="md:col-span-3">
              {selectedProverb ? (
                <div className="flex flex-col space-y-6">
                  <div
                    ref={proverbCardRef}
                    className="relative bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    {/* Card Top Decorative Element */}
                    <div className="h-3 bg-gradient-to-r from-amber-500 to-orange-500"></div>

                    <div className="p-8 md:p-10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 leading-snug">
                        {selectedProverb.proverb}
                      </h2>
                      <p className="text-lg text-gray-700 mb-4 border-l-4 border-amber-300 pl-4">
                        <span className="font-medium text-amber-700 block mb-1">
                          Translation:
                        </span>{" "}
                        {selectedProverb.translation}
                      </p>
                      <p className="text-gray-600 border-l-4 border-gray-200 pl-4">
                        <span className="font-medium text-gray-700 block mb-1">
                          Wisdom:
                        </span>{" "}
                        {selectedProverb.wisdom}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap justify-center gap-4 mt-8 border-t border-gray-100 pt-6">
                        <button
                          onClick={copyToClipboard}
                          title="Copy to Clipboard"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                          <Copy size={16} />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={shareAsImage}
                          title="Download as Image"
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                        >
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() =>
                            removeFromFavorites(selectedProverb.id)
                          }
                          title="Remove from Favorites"
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                        >
                          <Heart size={16} fill="currentColor" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Source indicator */}
                      <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                        Proverb #{selectedProverb.id}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <p className="text-gray-500 mb-4">
                    Select a proverb from your collection to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Yoruba Proverbs App. All rights
            reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
