"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useContinueWatching } from "@/context/ContinueWatchingContext";
import ContinueWatchingCard from "./ContinueWatchingCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ContinueWatchingSection() {
  const { continueWatching } = useContinueWatching();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Solo las 10 más recientes
  const items = (continueWatching || []).slice(0, 10);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [items.length, updateArrows]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.85, 280);
    const max = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + dir * amount;

    // Carrusel infinito: al pasar el final vuelve al inicio y viceversa
    if (dir > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 12) {
      next = 0;
    } else if (dir < 0 && el.scrollLeft <= 12) {
      next = max;
    }

    el.scrollTo({ left: next, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  // Duplicar lista si hay pocos items para sensación de loop continuo al hacer scroll
  const loopItems =
    items.length >= 4 && items.length < 8
      ? [...items, ...items]
      : items;

  return (
    <>
      <style jsx global>{`
        .cw-section {
          margin: 32px 0;
          position: relative;
        }
        .cw-header {
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cw-title {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          letter-spacing: -0.01em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cw-subtitle {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-left: auto;
        }
        .cw-carousel {
          position: relative;
        }
        .cw-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          padding: 4px 2px 12px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .cw-track::-webkit-scrollbar {
          display: none;
        }
        .cw-slide {
          flex: 0 0 auto;
          width: min(42vw, 160px);
          scroll-snap-align: start;
        }
        @media (min-width: 640px) {
          .cw-slide {
            width: 150px;
          }
        }
        @media (min-width: 1024px) {
          .cw-slide {
            width: 160px;
          }
        }
        .cw-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-60%);
          z-index: 5;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.15s, opacity 0.15s, transform 0.15s;
          opacity: 0;
          pointer-events: none;
        }
        .cw-carousel:hover .cw-arrow,
        .cw-arrow.cw-arrow-visible {
          opacity: 1;
          pointer-events: auto;
        }
        .cw-arrow:hover {
          background: rgba(229, 9, 20, 0.9);
          border-color: rgba(229, 9, 20, 0.5);
          transform: translateY(-60%) scale(1.05);
        }
        .cw-arrow-left {
          left: -6px;
        }
        .cw-arrow-right {
          right: -6px;
        }
        @media (max-width: 768px) {
          .cw-arrow {
            opacity: 1;
            pointer-events: auto;
            width: 36px;
            height: 36px;
          }
          .cw-arrow-left {
            left: 0;
          }
          .cw-arrow-right {
            right: 0;
          }
        }
      `}</style>

      <section className="cw-section">
        <div className="cw-header">
          <h2 className="cw-title">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Continuar Viendo
          </h2>
          <p className="cw-subtitle">Retoma donde lo dejaste</p>
        </div>

        <div className="cw-carousel">
          {items.length > 3 && (
            <button
              type="button"
              className={`cw-arrow cw-arrow-left ${canPrev ? "cw-arrow-visible" : ""}`}
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div className="cw-track" ref={trackRef}>
            {loopItems.map((item, idx) => (
              <div
                className="cw-slide"
                key={`${item.type}-${item.id}-${idx}`}
              >
                <ContinueWatchingCard item={item} />
              </div>
            ))}
          </div>

          {items.length > 3 && (
            <button
              type="button"
              className={`cw-arrow cw-arrow-right ${canNext ? "cw-arrow-visible" : ""}`}
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </section>
    </>
  );
}
