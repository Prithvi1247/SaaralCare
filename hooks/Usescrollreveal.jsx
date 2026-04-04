// hooks/useScrollReveal.js
import { useEffect, useRef } from "react";

/**
 * Attach this ref to a container element.
 * Any child with className "reveal" will fade-up into view
 * when it enters the viewport.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref}> <div className="reveal">...</div> </section>
 */
export default function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}