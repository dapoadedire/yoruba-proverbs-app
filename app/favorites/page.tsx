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
    const storedFavorites = localStorage.getItem("favoriteProverbs");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
      // Select first proverb if available
      const parsedFavorites = JSON.parse(storedFavorites);
      if (parsedFavorites.length > 0 && !selectedProverb) {
        setSelectedProverb(parsedFavorites[0]);
      }
    }
  }, []);

  // Update localStorage when favorites change
  useEffect(() => {
    localStorage.setItem("favoriteProverbs", JSON.stringify(favorites));

    // If the selected proverb is removed, select another one or set to null
    if (
      selectedProverb &&
      !favorites.some((fav) => fav.id === selectedProverb.id)
    ) {
      setSelectedProverb(favorites.length > 0 ? favorites[0] : null);
    }
  }, [favorites]);

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((proverb) => proverb.id !== id));
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
    <main className="container mx-auto px-4 py-12 max-w-3xl flex flex-col items-center">
      <header className="mb-8 text-center w-full flex items-center justify-center relative">
        <Link
          href="/"
          className="absolute left-0 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Back
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-800">
          Favorite Proverbs
        </h1>
      </header>

      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-6">
            You don&apos;t have any favorite proverbs yet.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            Browse Proverbs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Sidebar with all favorites */}
          <div className="md:col-span-1 border border-gray-200 rounded-lg p-4 h-fit max-h-[600px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Your Favorites ({favorites.length})
            </h2>
            <ul className="space-y-3">
              {favorites.map((proverb) => (
                <li
                  key={proverb.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${
                    selectedProverb?.id === proverb.id
                      ? "bg-gray-100 border-l-4 border-blue-500"
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

          {/* Selected Proverb Detail View */}
          <div className="md:col-span-2">
            {selectedProverb ? (
              <div className="flex flex-col space-y-4">
                <div
                  ref={proverbCardRef}
                  className="border border-gray-200 bg-white rounded-lg shadow-lg p-6 md:p-8 w-full"
                >
                  <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 leading-tight">
                    {selectedProverb.proverb}
                  </h2>
                  <p className="text-lg text-gray-700 mb-2">
                    <strong className="font-medium">Translation:</strong>{" "}
                    {selectedProverb.translation}
                  </p>
                  <p className="text-gray-600">
                    <strong className="font-medium">Wisdom:</strong>{" "}
                    {selectedProverb.wisdom}
                  </p>
                </div>

                {/* Actions for selected proverb */}
                <div className="flex space-x-3 justify-center">
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
                    onClick={() => removeFromFavorites(selectedProverb.id)}
                    title="Remove from Favorites"
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <p className="text-gray-500 mb-4">
                  Select a proverb from your favorites to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Yoruba Proverbs App. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
