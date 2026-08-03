"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven double marquee (Jack style). Row 1 drifts right, row 2
 * drifts left as the page scrolls. Images are tripled for a seamless band.
 */
export default function ScrollMarquee({ images }: { images: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    function onScroll() {
      if (!element) return;
      const sectionTop = element.offsetTop;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (images.length === 0) return null;

  const half = Math.ceil(images.length / 2);
  const row1 = images.slice(0, half);
  const row2 = images.slice(half).length > 0 ? images.slice(half) : row1;

  const tripled1 = [...row1, ...row1, ...row1];
  const tripled2 = [...row2, ...row2, ...row2];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#0C0C0C] pt-24 pb-10 sm:pt-32 md:pt-40"
    >
      <div className="flex flex-col gap-3">
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(${offset - 200}px)`,
            willChange: "transform",
          }}
        >
          {tripled1.map((src, index) => (
            <Tile key={`r1-${index}`} src={src} />
          ))}
        </div>
        <div
          className="flex justify-end gap-3"
          style={{
            transform: `translateX(${-(offset - 200)}px)`,
            willChange: "transform",
          }}
        >
          {tripled2.map((src, index) => (
            <Tile key={`r2-${index}`} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      className="h-[170px] w-[264px] shrink-0 rounded-2xl object-cover sm:h-[220px] sm:w-[342px] md:h-[270px] md:w-[420px]"
    />
  );
}
