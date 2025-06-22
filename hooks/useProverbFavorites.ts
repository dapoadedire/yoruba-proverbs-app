import { useCallback } from "react";
import { toast } from "sonner";
import { Proverb } from "./useProverbManager";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Custom hook for managing proverb favorites in the dynamic [id] route
 */
export function useProverbFavorites() {
  // Manage favorites with localStorage
  const [favorites, setFavorites] = useLocalStorage<Proverb[]>(
    "favoriteProverbs",
    []
  );

  // Check if a proverb is in favorites
  const isFavorite = useCallback(
    (id: number | undefined): boolean => {
      if (id === undefined) return false;
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  // Toggle favorite status for a specific proverb
  const toggleFavoriteById = useCallback(
    (proverb: Proverb | null) => {
      if (!proverb) return;

      if (isFavorite(proverb.id)) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(
          (fav) => fav.id !== proverb.id
        );
        setFavorites(updatedFavorites);
        toast.info("Removed from favorites.");
      } else {
        // Add to favorites
        const updatedFavorites = [...favorites, proverb];
        setFavorites(updatedFavorites);
        toast.success("Added to favorites!");
      }
    },
    [favorites, isFavorite, setFavorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavoriteById,
  };
}
