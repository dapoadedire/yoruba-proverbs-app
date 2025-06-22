import { toast } from "sonner";
import { toPng } from "html-to-image";

interface ShareAsImageOptions {
  element: HTMLElement;
  fileName: string;
  title?: string;
  text?: string;
}

/**
 * Convert an HTML element to an image and download it, with optional sharing
 * @param options Configuration for the image generation and sharing
 */
export const shareAsImage = async ({
  element,
  fileName,
  title = "Shared Image",
  text = "",
}: ShareAsImageOptions): Promise<void> => {
  if (!element) {
    toast.error("Could not generate image.");
    return;
  }

  try {
    // Generate image from HTML element
    const dataUrl = await toPng(element, {
      cacheBust: true,
      quality: 1,
      pixelRatio: 2, // Higher quality
    });

    // Handle download
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    toast.success("Image downloaded!");

    // Optional: Direct share using Web Share API (if supported)
    if (navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: blob.type });

        await navigator.share({
          title,
          text,
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
    console.error("Failed to generate image:", err);
    toast.error("Failed to generate image.");
  }
};
