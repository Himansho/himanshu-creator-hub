"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Character-by-character scroll-reveal text (Jack style).
 * Each character fades from 0.2 → 1 opacity as the paragraph
 * scrolls through the viewport window ['start 0.8', 'end 0.2'].
 */
export default function AnimatedText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const characters = Array.from(text);

  return (
    <p ref={ref} className={className}>
      {characters.map((char, index) => (
        <Char
          key={index}
          char={char}
          progress={scrollYProgress}
          range={[index / characters.length, (index + 1) / characters.length]}
        />
      ))}
    </p>
  );
}

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}
