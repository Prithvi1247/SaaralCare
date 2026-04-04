import { useEffect } from "react";

export default function CursorEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cursor = document.createElement("div");
    const cursorRing = document.createElement("div");
    const cursorGradient = document.createElement("div");

    cursor.id = "custom-cursor";
    cursorRing.id = "custom-cursor-ring";
    cursorGradient.id = "custom-cursor-gradient";

    Object.assign(cursor.style, {
      position: "fixed",
      width: "12px",
      height: "12px",
      background: "#38bdf8",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "9999",
      transform: "translate(-50%, -50%)",
      transition: "transform 0.1s ease, width 0.2s, height 0.2s, opacity 0.2s",
      mixBlendMode: "screen",
      opacity: "0.8",
    });

    Object.assign(cursorRing.style, {
      position: "fixed",
      width: "36px",
      height: "36px",
      border: "1px solid rgba(56, 189, 248, 0.4)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "9998",
      transform: "translate(-50%, -50%)",
      transition: "transform 0.18s ease, width 0.3s, height 0.3s, border-color 0.3s",
    });

    Object.assign(cursorGradient.style, {
      position: "fixed",
      width: "600px",
      height: "600px",
      background: "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)",
      pointerEvents: "none",
      zIndex: "-1",
      transform: "translate(-50%, -50%)",
      transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    });

    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);
    document.body.appendChild(cursorGradient);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ringX = mx;
    let ringY = my;
    let gradX = mx;
    let gradY = my;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    };

    const animate = () => {
      ringX += (mx - ringX) * 0.12;
      ringY += (my - ringY) * 0.12;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";

      gradX += (mx - gradX) * 0.05;
      gradY += (my - gradY) * 0.05;
      cursorGradient.style.left = gradX + "px";
      cursorGradient.style.top = gradY + "px";

      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    animate();

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cursor.remove();
      cursorRing.remove();
      cursorGradient.remove();
      document.body.style.cursor = "auto";
    };
  }, []);

  return null;
}
