"use client";
import { useRef, useEffect, useCallback } from "react";
import { useContinueWatching } from "@/context/ContinueWatchingContext";
import ContinueWatchingCard from "./ContinueWatchingCard";

export default function ContinueWatchingSection() {
  const { continueWatching } = useContinueWatching();
  const trackRef = useRef(null);
  const isJumping = useRef(false);

  // Solo las 10 más recientes
  const items = (continueWatching || []).slice(0, 10);

  if (items.length === 0) return null;

  // Triplicar para loop infinito real: [A B C] [A B C] [A B C]
  // El scroll vive en el bloque del medio y salta sin que se note
  const loopItems =
    items.length === 1
      ? items
      : [...items, ...items, ...items];

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || isJumping.current || items.length <= 1) return;

    const setWidth = el.scrollWidth / 3;

    // Si te pasas del bloque del medio hacia la derecha → vuelve al medio
    if (el.scrollLeft >= setWidth * 2 - 2) {
      isJumping.current = true;
      el.scrollLeft = el.scrollLeft - setWidth;
      isJumping.current = false;
    }
    // Si te vas hacia la izquierda del bloque del medio → salta al medio
    else if (el.scrollLeft <= 2) {
      isJumping.current = true;
      el.scrollLeft = el.scrollLeft + setWidth;
      isJumping.current = false;
    }
  }, [items.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length <= 1) return;

    // Empezar en el bloque del medio
    const setWidth = el.scrollWidth / 3;
    el.scrollLeft = setWidth;

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length, onScroll]);

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
        .cw-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
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

        <div className="cw-track" ref={trackRef}>
          {loopItems.map((item, idx) => (
            <div className="cw-slide" key={`${item.type}-${item.id}-${idx}`}>
              <ContinueWatchingCard item={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
