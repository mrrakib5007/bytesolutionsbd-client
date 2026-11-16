/**
 * Upload an image file to ImgBB and return the hosted direct URL
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Hosted image URL
 */
export async function uploadImageToImgBB(file) {
  if (!file) {
    throw new Error("No image file provided.");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Selected file must be an image (PNG, JPG, WEBP).");
  }

  // Limit size to 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB.");
  }

  const apiKey =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY || "9a66d03d09a2b535fa1947a505bfa802";

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (result?.success && result.data?.url) {
    return result.data.url;
  }

  throw new Error(
    result?.error?.message || "Failed to upload image. Please try again."
  );
}
