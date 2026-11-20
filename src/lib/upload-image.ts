const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type))
    throw new Error("Choose a JPG, PNG, or WebP image.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("Choose an image smaller than 5 MB.");
}

export async function uploadImageToImgbb(file: File) {
  validateImageFile(file);
  const body = new FormData();
  body.append("image", file);
  const response = await fetch("/api/upload-image", {
    method: "POST",
    body,
    credentials: "same-origin",
    cache: "no-store",
  });
  const result = (await response.json().catch(() => ({}))) as {
    url?: string;
    message?: string;
  };
  if (!response.ok || !result.url)
    throw new Error(result.message || "Image upload failed. Please try again.");
  return result.url;
}
