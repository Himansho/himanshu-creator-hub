/**
 * Validation rules from PRD §7.4 — shared by the dashboard forms (client)
 * and the server actions (server), so the two can never disagree.
 */

export const LIMITS = {
  titleMax: 80,
  summaryMax: 160,
  tagMax: 20,
  avatarMaxBytes: 2 * 1024 * 1024, // 2 MB
  coverMaxBytes: 5 * 1024 * 1024, // 5 MB
} as const;

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

/** Adds https:// to a bare link like "example.com"; returns "" for empty input. */
export function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function isValidUrl(value: string): boolean {
  if (!value) return true; // optional fields
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function cleanTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const trimmed = tag.trim().slice(0, LIMITS.tagMax);
    const key = trimmed.toLowerCase();
    if (trimmed && !seen.has(key)) {
      seen.add(key);
      result.push(trimmed);
    }
  }
  return result;
}

/** Plain-language image check used before any upload. Returns an error message or null. */
export function imageFileError(
  file: File,
  kind: "avatar" | "cover"
): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "That file type isn't supported — please use a PNG, JPG, WebP, or GIF image.";
  }
  const max = kind === "avatar" ? LIMITS.avatarMaxBytes : LIMITS.coverMaxBytes;
  if (file.size > max) {
    const mb = max / (1024 * 1024);
    return `This image is too big — please use one under ${mb} MB.`;
  }
  return null;
}

/** Validates project form input. Returns an error message or null. */
export function projectInputError(input: {
  title: string;
  summary: string;
  video_url?: string;
  demo_url: string;
  repo_url: string;
}): string | null {
  if (!input.title.trim()) return "Please give your project a title.";
  if (input.title.trim().length > LIMITS.titleMax) {
    return `The title is too long — please keep it under ${LIMITS.titleMax} characters.`;
  }
  if (input.summary.length > LIMITS.summaryMax) {
    return `The summary is too long — please keep it under ${LIMITS.summaryMax} characters.`;
  }
  if (input.video_url && !isValidUrl(input.video_url)) {
    return "The video link doesn't look like a valid web address.";
  }
  if (!isValidUrl(input.demo_url)) {
    return "The live demo link doesn't look like a valid web address.";
  }
  if (!isValidUrl(input.repo_url)) {
    return "The code link doesn't look like a valid web address.";
  }
  return null;
}
