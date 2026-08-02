"use client";

import { useRef, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { uniqueStoragePath } from "@/lib/utils";
import { imageFileError } from "@/lib/validation";
import { useToast } from "./Toast";

/**
 * Uploads straight from the browser to Supabase Storage. Every upload gets a
 * unique file path (PRD F-19) so the CDN never serves a stale image; the
 * replaced file is deleted by the server action when the form is saved.
 */
export default function ImageUpload({
  label,
  bucket,
  kind,
  value,
  onChange,
}: {
  label: string;
  bucket: "avatars" | "project-images";
  kind: "avatar" | "cover";
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const configured = hasSupabaseEnv();

  async function handleFile(file: File) {
    const error = imageFileError(file, kind);
    if (error) {
      toast(error, "error");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const path = uniqueStoragePath(file.name);
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type, cacheControl: "3600" });
      if (uploadError) {
        toast(
          "The upload didn't go through. Please check your connection and try again.",
          "error"
        );
        return;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm text-muted">{label}</span>

      {!configured ? (
        <p className="rounded-xl border border-edge px-4 py-3 text-sm text-faint">
          Image uploads switch on once Supabase is connected (README setup).
        </p>
      ) : (
        <div className="flex items-center gap-4">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Current image"
              className={`border border-edge object-cover ${
                kind === "avatar"
                  ? "h-20 w-20 rounded-full"
                  : "h-20 w-36 rounded-xl"
              }`}
            />
          ) : (
            <div
              className={`flex items-center justify-center border border-dashed border-edge text-xs text-faint ${
                kind === "avatar"
                  ? "h-20 w-20 rounded-full"
                  : "h-20 w-36 rounded-xl"
              }`}
            >
              No image
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-edge px-4 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-ink disabled:opacity-50"
            >
              {uploading
                ? "Uploading…"
                : value
                  ? "Replace image"
                  : "Upload image"}
            </button>
            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="text-left text-xs text-faint transition-colors hover:text-danger"
              >
                Remove image
              </button>
            )}
            <p className="text-xs text-faint">
              PNG, JPG, WebP, or GIF · max {kind === "avatar" ? "2" : "5"} MB
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
      )}
    </div>
  );
}
