"use client";

import { useRef, useState } from "react";

/**
 * Mouse-following magnetic hover effect (Jack style). The child drifts
 * toward the cursor when it comes within `padding` px of the element,
 * scaled down by `strength`.
 */
export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  className = "",
}: {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");
  const [active, setActive] = useState(false);

  function handleMouseMove(event: React.MouseEvent) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const deltaX = event.clientX - (rect.left + rect.width / 2);
    const deltaY = event.clientY - (rect.top + rect.height / 2);

    const within =
      Math.abs(deltaX) < rect.width / 2 + padding &&
      Math.abs(deltaY) < rect.height / 2 + padding;

    if (within) {
      setActive(true);
      setTransform(
        `translate3d(${deltaX / strength}px, ${deltaY / strength}px, 0)`
      );
    } else {
      setActive(false);
      setTransform("translate3d(0, 0, 0)");
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setActive(false);
        setTransform("translate3d(0, 0, 0)");
      }}
    >
      <div
        style={{
          transform,
          transition: active
            ? "transform 0.3s ease-out"
            : "transform 0.6s ease-in-out",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
