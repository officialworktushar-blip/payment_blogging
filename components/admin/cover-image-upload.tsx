"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { deleteImageUrl, uploadImage } from "@/lib/uploadImage";

interface CoverImageUploadProps {
  value: string | null;
  alt: string;
  note: string;
  onChange: (url: string | null) => void;
  onAltChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function CoverImageUpload({
  value,
  alt,
  note,
  onChange,
  onAltChange,
  onNoteChange,
  onUploadingChange,
}: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    onUploadingChange(true);

    try {
      const uploaded = await uploadImage(file, "covers");
      onChange(uploaded.url);

      if (value && value !== uploaded.url) {
        try {
          await deleteImageUrl(value);
        } catch {
          return;
        }
      }
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Cover upload failed.");
    } finally {
      onUploadingChange(false);
    }
  }

  async function handleRemove() {
    if (!value) {
      return;
    }

    setError("");
    onUploadingChange(true);

    try {
      await deleteImageUrl(value);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not delete the old image.");
    } finally {
      onChange(null);
      onUploadingChange(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = Array.from(event.dataTransfer.files)[0];
    if (file) {
      void handleFile(file);
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl border border-dashed p-3 transition-colors motion-reduce:transition-none ${
          dragging ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50"
        }`}
      >
        {value ? (
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={value}
              alt={alt || "Cover preview"}
              width={640}
              height={360}
              unoptimized
              className="h-40 w-full object-cover"
            />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-slate-700"
              >
                <ImagePlus aria-hidden="true" size={13} />
                Replace
              </button>
              <button
                type="button"
                onClick={() => void handleRemove()}
                className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-error-dark"
              >
                <Trash2 aria-hidden="true" size={13} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg text-slate-500"
          >
            <Upload aria-hidden="true" size={22} />
            <span className="text-sm font-medium">Drop a cover image or click to browse</span>
            <span className="text-xs">JPG, PNG or WebP, max 5 MB</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleFile(file);
            }
            event.target.value = "";
          }}
        />
      </div>

      <div>
        <label htmlFor="cover-alt" className="mb-1.5 block text-xs font-medium text-slate-600">
          Alt text
        </label>
        <input
          id="cover-alt"
          value={alt}
          onChange={(event) => onAltChange(event.target.value)}
          className={fieldClass}
          placeholder="Diagram of a card payment flow"
        />
      </div>

      <div>
        <label htmlFor="cover-note" className="mb-1.5 block text-xs font-medium text-slate-600">
          Image note / mockup suggestion
        </label>
        <textarea
          id="cover-note"
          rows={3}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          className={fieldClass}
          placeholder="Describe the image or mockup needed for this cover."
        />
      </div>

      {error ? <p className="text-xs text-error-dark">{error}</p> : null}
    </div>
  );
}
