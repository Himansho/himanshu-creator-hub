import Image from "next/image";
import { initials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

/**
 * The animated avatar (PRD §7.5). Shows the uploaded image when one exists
 * (animated GIFs skip optimization so they keep moving); otherwise renders
 * the default animated illustration.
 */
export default function Avatar({
  profile,
  size = "lg",
}: {
  profile: Profile;
  size?: "lg" | "sm";
}) {
  const dimension = size === "lg" ? "h-56 w-56 md:h-72 md:w-72" : "h-28 w-28";
  const textSize = size === "lg" ? "text-6xl md:text-7xl" : "text-3xl";

  return (
    <div className={`relative ${dimension} animate-float`}>
      {/* Ambient glow */}
      <div
        className="absolute -inset-6 rounded-full bg-accent/20 blur-3xl animate-pulse-glow"
        aria-hidden="true"
      />
      {/* Gradient ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-accent/30 to-transparent p-[3px]">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-elevate">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={`${profile.full_name}'s avatar`}
              fill
              sizes={size === "lg" ? "288px" : "112px"}
              className="rounded-full object-cover"
              unoptimized={profile.avatar_url.toLowerCase().includes(".gif")}
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center">
              {/* Default illustration: soft gradient field + initials */}
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(circle at 30% 25%, rgba(245,176,64,0.35), transparent 55%), radial-gradient(circle at 72% 70%, rgba(94,158,214,0.28), transparent 55%)",
                }}
                aria-hidden="true"
              />
              <span
                className={`relative bg-gradient-to-br from-ink to-muted bg-clip-text font-bold tracking-tight text-transparent ${textSize}`}
              >
                {initials(profile.full_name)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
