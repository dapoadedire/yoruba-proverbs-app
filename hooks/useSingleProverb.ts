import { useState, useEffect } from "react";
import { Proverb } from "./useProverbManager";

/**
 * Custom hook to fetch a single proverb by ID
 */
export function useSingleProverb(id: string | null) {
  const [proverb, setProverb] = useState<Proverb | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No proverb ID provided");
      return;
    }

    const fetchProverbById = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://yoruba-proverb-api-v2.onrender.com/proverb/${id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch proverb with ID ${id}`);
        }

        const data = await response.json();
        setProverb(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching proverb:", err);
        setError("Failed to load this proverb. It may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchProverbById();
  }, [id]);

  return {
    proverb,
    loading,
    error,
  };
}
