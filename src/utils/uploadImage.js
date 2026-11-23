const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Upload an image file securely via backend server to ImgBB and return the hosted direct URL
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Hosted image URL
 */
export async function uploadImageToImgBB(file) {
  if (!file) {
    throw new Error("No image file provided.");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Selected file must be an image (PNG, JPG, JPEG, WEBP).");
  }

  // Limit size to 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image size must be less than 10MB.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await response.json();

  if (result?.success && result.data?.url) {
    return result.data.url;
  }

  throw new Error(
    result?.message || "Failed to upload image. Please try again."
  );
}
