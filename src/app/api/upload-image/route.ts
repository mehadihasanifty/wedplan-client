const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const UPLOAD_LIMIT = 12;
const UPLOAD_WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; expiresAt: number }>();

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { message: "Image uploads are not configured on the server." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isAllowedOrigin(request)) {
    return Response.json({ message: "This upload origin is not allowed." }, { status: 403 });
  }

  const now = Date.now();
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const attempt = attempts.get(clientIp);
  if (attempt && attempt.expiresAt > now && attempt.count >= UPLOAD_LIMIT) {
    return Response.json(
      { message: "Too many image uploads. Please try again in a few minutes." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }
  attempts.set(clientIp, {
    count: attempt && attempt.expiresAt > now ? attempt.count + 1 : 1,
    expiresAt: attempt && attempt.expiresAt > now ? attempt.expiresAt : now + UPLOAD_WINDOW_MS,
  });
  if (attempts.size > 1000) {
    for (const [ip, entry] of attempts) if (entry.expiresAt <= now) attempts.delete(ip);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_IMAGE_SIZE + 64 * 1024) {
    return Response.json({ message: "Choose an image smaller than 5 MB." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ message: "Upload the image as multipart form data." }, { status: 400 });
  }
  const image = form.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return Response.json({ message: "Choose an image file to upload." }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_SIZE) {
    return Response.json({ message: "Choose an image smaller than 5 MB." }, { status: 413 });
  }
  if (!ALLOWED_TYPES.has(image.type)) {
    return Response.json({ message: "Choose a JPG, PNG, or WebP image." }, { status: 415 });
  }

  const bytes = new Uint8Array(await image.arrayBuffer());
  if (!matchesImageSignature(image.type, bytes)) {
    return Response.json({ message: "The selected file is not a valid image." }, { status: 415 });
  }

  const upload = new FormData();
  upload.append("image", image, image.name || "wedplan-image");
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      body: upload,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const result = await response.json().catch(() => null) as {
      success?: boolean;
      data?: { url?: string };
      error?: { message?: string };
    } | null;
    if (!response.ok || !result?.success || !result.data?.url) {
      return Response.json(
        { message: result?.error?.message || "Image upload failed. Please try again." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }
    const imageUrl = new URL(result.data.url);
    if (imageUrl.protocol !== "https:") throw new Error("ImgBB returned an invalid image URL.");
    return Response.json({ url: imageUrl.toString() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { message: "Could not reach ImgBB. Please try the upload again." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const configuredOrigins = [process.env.CLIENT_URL, process.env.BETTER_AUTH_URL]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim().replace(/\/$/, ""));
  return configuredOrigins.length === 0 || configuredOrigins.includes(origin.replace(/\/$/, ""));
}

function matchesImageSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}
