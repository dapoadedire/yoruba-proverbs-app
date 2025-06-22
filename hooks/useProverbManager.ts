import { useCallback } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

// Proverb interface
export interface Proverb {
  id: number;
  proverb: string;
  translation: string;
  wisdom: string;
}

/**
 * Custom hook to manage proverbs and favorites
 */
export function useProverbManager() {
  // Manage favorites with localStorage
  const [favorites, setFavorites, refreshFavorites] = useLocalStorage<
    Proverb[]
  >("favoriteProverbs", []);

  // Create a function to fetch proverb that will be used by React Query
  const fetchProverbData = async (): Promise<Proverb> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/proverb`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  // Use React Query to fetch proverb data
  const {
    data: proverb,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["proverb"],
    queryFn: fetchProverbData,
    staleTime: Infinity, // Don't automatically refetch since we want manual control
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 2, // Retry failed requests twice
  });

  // Function to fetch a new proverb
  const fetchNewProverb = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error fetching proverb:", error);
      toast.error("Failed to fetch proverb.");
    }
  };

  // Check if a proverb is in favorites
  const isFavorite = useCallback(
    (id: number | undefined): boolean => {
      if (id === undefined) return false;
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(() => {
    if (!proverb) return;

    if (isFavorite(proverb.id)) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav) => fav.id !== proverb.id);
      setFavorites(updatedFavorites);
      toast.info("Removed from favorites.");
    } else {
      // Add to favorites
      const updatedFavorites = [...favorites, proverb];
      setFavorites(updatedFavorites);
      toast.success("Added to favorites!");
    }
  }, [proverb, favorites, isFavorite, setFavorites]);

  return {
    proverb,
    isLoading,
    error,
    fetchNewProverb,
    favorites,
    refreshFavorites,
    isFavorite,
    toggleFavorite,
  };
}
