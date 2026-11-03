"use client";
import { useEffect, useRef, useState } from "react";
import { isChristmasSeason, daysToChristmas } from "@/lib/christmas";

const SNOW_KEY = "wplex-xmas-snow";
const BANNER_KEY = "wplex-xmas-banner";

export default function ChristmasEffects() {
  const canvasRef = useRef(null);
  const [season, setSeason] = useState(false);
  const [snow, setSnow] = useState(true);
  const [banner, setBanner] = useState(true);
  const [days, setDays] = useState(null);

  // Estado inicial (solo en cliente para evitar errores de hidratación)
  useEffect(() => {
    if (!isChristmasSeason()) return;
    setSeason(true);
    setDays(daysToChristmas());
    document.documentElement.classList.add("xmas");

    try {
      const saved = localStorage.getItem(SNOW_KEY);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setSnow(saved === null ? !reduce : saved === "on");
      setBanner(sessionStorage.getItem(BANNER_KEY) !== "closed");
    } catch {}

    return () => document.documentElement.classList.remove("xmas");
  }, []);

  // Nieve en canvas
  useEffect(() => {
    if (!season || !snow) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let raf = 0;
    let flakes = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor(w / 9), 140);
      flakes = Array.from({ length: count }, () => makeFlake(true));
    };

    const makeFlake = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: 1 + Math.random() * 2.6,
      vy: 0.5 + Math.random() * 1.2,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.015,
      alpha: 0.4 + Math.random() * 0.6,
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy;
        f.sway += f.swaySpeed;
        f.x += Math.sin(f.sway) * 0.6;
        if (f.y > h + 10) Object.assign(f, makeFlake(false));
        if (f.x > w + 10) f.x = -10;
        if (f.x < -10) f.x = w + 10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [season, snow]);

  const toggleSnow = () => {
    const next = !snow;
    setSnow(next);
    try {
      localStorage.setItem(SNOW_KEY, next ? "on" : "off");
    } catch {}
  };

  const closeBanner = () => {
    setBanner(false);
    try {
      sessionStorage.setItem(BANNER_KEY, "closed");
    } catch {}
  };

  if (!season) return null;

  let message = "🎄 ¡Feliz Navidad desde WPLEX! 🎁";
  if (days > 1) message = `🎄 Faltan ${days} días para Navidad · Maratón navideño en WPLEX 🎅`;
  else if (days === 1) message = "🎄 ¡Mañana es Nochebuena! 🎅";
  else if (days === 0) message = "🎄 ¡Feliz Navidad! Gracias por estar en WPLEX 🎁";
  else if (days < 0 && days > -12) message = "✨ ¡Felices fiestas! Que empiece un gran año 🎆";

  return (
    <>
      {snow && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="xmas-snow-canvas"
        />
      )}

      {banner && (
        <div className="xmas-banner" role="status">
          <span>{message}</span>
          <button
            type="button"
            onClick={closeBanner}
            aria-label="Cerrar aviso navideño"
            className="xmas-banner-close"
          >
            ✕
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={toggleSnow}
        className="xmas-snow-toggle"
        aria-pressed={snow}
        aria-label={snow ? "Quitar la nieve" : "Poner nieve"}
        title={snow ? "Quitar la nieve" : "Poner nieve"}
      >
        {snow ? "⛄" : "❄️"}
      </button>
    </>
  );
}
