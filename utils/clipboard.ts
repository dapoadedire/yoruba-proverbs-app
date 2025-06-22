import { toast } from "sonner";

/**
 * Copy text to clipboard
 * @param text Text to copy
 * @param successMessage Success message to display (optional)
 * @returns Promise resolved when copying is complete
 */
export const copyToClipboard = async (
  text: string,
  successMessage: string = "Copied to clipboard!"
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error("Failed to copy text.");
  }
};
