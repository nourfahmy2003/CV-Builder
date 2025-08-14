import { useEffect, useRef, useState } from 'react';
import '../styles/ai-suggestions.css';

/**
 * Split before/after slider used inside AI suggestion cards. The slider uses
 * a masked "before" panel over the improved text so the handle and track never
 * cover text. It supports pointer and keyboard interaction and keeps a minimum
 * 16px gutter on both edges.
 */
export default function BeforeAfterSlider({ before = '', after = '' }) {
  const containerRef = useRef(null);
  const handleRef = useRef(null);
  const trackRef = useRef(null);
  const beforeRef = useRef(null);

  const [percent, setPercent] = useState(50);
  const animRef = useRef();

  // Update styles using transform/clip-path to avoid layout thrash
  const renderPos = (pct) => {
    const container = containerRef.current;
    const handle = handleRef.current;
    const track = trackRef.current;
    const beforePanel = beforeRef.current;
    if (!container || !handle || !track || !beforePanel) return;

    const width = container.offsetWidth;
    const x = (pct / 100) * width;
    handle.style.transform = `translateX(${x - 12}px)`; // center handle
    track.style.transform = `translateX(${x - 1}px)`; // center 2px track
    beforePanel.style.clipPath = `inset(0 calc(100% - ${pct}%) 0 0)`;
    handle.setAttribute('aria-valuenow', Math.round(pct));
  };

  const clampPct = (x, width) => {
    const min = 16;
    const max = width - 16;
    const clamped = Math.min(Math.max(x, min), max);
    return (clamped / width) * 100;
  };

  const snapPct = (pct, width) => {
    const snaps = [0.25, 0.5, 0.75].map((s) => s * width);
    const x = (pct / 100) * width;
    const snapped = snaps.find((s) => Math.abs(x - s) <= 8);
    return snapped !== undefined ? (snapped / width) * 100 : pct;
  };

  const updatePct = (pct) => {
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      setPercent(pct);
      renderPos(pct);
    });
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const onMove = (ev) => {
      const pct = clampPct(ev.clientX - rect.left, rect.width);
      updatePct(pct);
    };

    const onUp = (ev) => {
      const pct = clampPct(ev.clientX - rect.left, rect.width);
      updatePct(snapPct(pct, rect.width));
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 5;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updatePct(Math.max(percent - step, 0));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      updatePct(Math.min(percent + step, 100));
    }
  };

  const handleDoubleClick = () => {
    updatePct(percent < 50 ? 65 : 35);
  };

  useEffect(() => {
    renderPos(percent);
  }, []);

  if (!after) return null;

  return (
    <div ref={containerRef} className="ba-slider">
      <div className="ba-panel ba-after">
        <span className="ba-label ba-label-after">IMPROVED</span>
        <p>{after}</p>
      </div>
      {before && (
        <div
          ref={beforeRef}
          className="ba-panel ba-before"
          style={{ clipPath: `inset(0 calc(100% - ${percent}%) 0 0)` }}
        >
          <span className="ba-label ba-label-before">BEFORE</span>
          <p>{before}</p>
        </div>
      )}
      {before && <div ref={trackRef} className="ba-track" />}
      {before && (
        <button
          ref={handleRef}
          className="ba-handle"
          role="slider"
          aria-label="Before/After slider"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(percent)}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          onDoubleClick={handleDoubleClick}
        />
      )}
      {before && (
        <span className="sr-only" aria-live="polite">
          {`Showing ${Math.round(percent)}% original, ${100 - Math.round(percent)}% improved`}
        </span>
      )}
    </div>
  );
}

