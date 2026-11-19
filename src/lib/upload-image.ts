const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type))
    throw new Error("Choose a JPG, PNG, or WebP image.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("Choose an image smaller than 5 MB.");
}

export async function uploadImageToImgbb(file: File) {
  validateImageFile(file);
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey)
    throw new Error(
      "Image uploads are not configured. Add NEXT_PUBLIC_IMGBB_API_KEY and restart the app.",
    );

  const body = new FormData();
  body.append("image", file);
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body },
  );
  const result = (await response.json()) as {
    success?: boolean;
    data?: { url?: string };
    error?: { message?: string };
  };
  if (!response.ok || !result.success || !result.data?.url)
    throw new Error(
      result.error?.message || "Image upload failed. Please try another image.",
    );
  return result.data.url;
}
