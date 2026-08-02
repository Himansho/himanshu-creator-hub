/** "My Cool App!" → "my-cool-app" */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "project"
  );
}

/** "Himanshu Bartwal" → "HB" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * Extracts { bucket, path } from a Supabase Storage public URL so the old
 * object can be deleted when an image is replaced (PRD F-19).
 */
export function storageObjectFromUrl(
  url: string
): { bucket: string; path: string } | null {
  const marker = "/storage/v1/object/public/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const rest = url.slice(index + marker.length);
  const slash = rest.indexOf("/");
  if (slash === -1) return null;
  return {
    bucket: rest.slice(0, slash),
    path: decodeURIComponent(rest.slice(slash + 1).split("?")[0]!),
  };
}

/** Unique, safe storage path for an upload, e.g. "1722400000000-cover.webp". */
export function uniqueStoragePath(fileName: string): string {
  const safe = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-60);
  return `${Date.now()}-${safe}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
