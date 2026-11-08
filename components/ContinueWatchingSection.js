"use client";
import { useContinueWatching } from "@/context/ContinueWatchingContext";
import ContinueWatchingCard from "./ContinueWatchingCard";

export default function ContinueWatchingSection() {
  const { continueWatching } = useContinueWatching();

  // Solo las 10 más recientes
  const items = (continueWatching || []).slice(0, 10);

  if (items.length === 0) return null;

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
          scroll-snap-type: x mandatory;
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

        <div className="cw-track">
          {items.map((item) => (
            <div
              className="cw-slide"
              key={`${item.type}-${item.id}`}
            >
              <ContinueWatchingCard item={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
