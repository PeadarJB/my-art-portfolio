"use client";

import { useEffect, useRef } from "react";

/**
 * Custom circle cursor (all pages). A 26px difference-blended circle follows
 * the pointer and fills solid white over any clickable, so it self-inverts on
 * both the white gallery and the soot room. The element stays hidden until the
 * first mousemove, and CSS disables it entirely on coarse pointers (where the
 * native cursor is restored). Position updates write straight to the DOM node
 * — no React re-render per mousemove.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const dot = dotRef.current;
      if (!dot) {
        return;
      }
      dot.style.transform = `translate(${event.clientX - 13}px, ${event.clientY - 13}px)`;
      dot.style.opacity = "1";
      const target = event.target as Element | null;
      const clickable = target?.closest?.("a, button, [data-click]");
      dot.classList.toggle("is-active", Boolean(clickable));
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
