"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "blog-images";
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type ImageFolder = "covers" | "content";

export interface UploadedImage {
  url: string;
  path: string;
}

function assertValidFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Use a JPG, PNG or WebP image.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 5 MB or smaller.");
  }
}

async function convertToWebp(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("Canvas is not available in this browser.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Could not convert the image to WebP."));
      }
    }, "image/webp", 0.86);
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

function makePath(folder: ImageFolder): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${folder}/${random}.webp`;
}

function pathFromUrl(url: string | null): string | null {
  if (!url) {
    return null;
  }

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index < 0) {
    return null;
  }

  const raw = url.slice(index + marker.length).split("?")[0];
  if (!raw) {
    return null;
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function uploadImage(file: File, folder: ImageFolder): Promise<UploadedImage> {
  assertValidFile(file);

  const supabase = createClient();
  const webp = await convertToWebp(file);
  const path = makePath(folder);
  const { error } = await supabase.storage.from(BUCKET).upload(path, webp, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImageUrl(url: string | null): Promise<void> {
  const path = pathFromUrl(url);
  if (!path) {
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}

export function extractImageUrls(html: string): string[] {
  const tags = html.match(/<img[^>]+src=["'][^"']+["']/gi) ?? [];
  const urls = tags
    .map((tag) => tag.match(/src=["']([^"']+)["']/i)?.[1] ?? "")
    .filter((url) => pathFromUrl(url) !== null);

  return Array.from(new Set(urls));
}
