import { useEffect, useRef, useState } from 'react';
import '../styles/ai-suggestions.css';

export default function BeforeAfterSlider({ before = '', after = '' }) {
  const containerRef = useRef(null);
  const handleRef = useRef(null);
  const prevRef = useRef(50);
  const [pos, setPos] = useState(50); // percentage of before reveal
  const [dragging, setDragging] = useState(false);

  const clamp = (p, rect) => {
    let v = Math.min(Math.max(p, 0), 100);
    // snap points
    const px = (v / 100) * rect.width;
    const snaps = [25, 50, 75];
    for (const s of snaps) {
      const spx = (s / 100) * rect.width;
      if (Math.abs(px - spx) <= 8) {
        v = s;
        break;
      }
    }
    return v;
  };

  const updatePos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(clamp(pct, rect));
  };

  const startDrag = (e) => {
    e.preventDefault();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX != null) updatePos(clientX);
    setDragging(true);
    handleRef.current.focus();
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      if (clientX != null) updatePos(clientX);
    };
    const up = () => setDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging]);

  const handleKey = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const step = e.shiftKey ? 10 : 5;
      const delta = e.key === 'ArrowLeft' ? -step : step;
      setPos((p) => clamp(p + delta, rect));
      e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      prevRef.current = pos;
      setPos(50);
      const restore = () => {
        setPos(prevRef.current);
        window.removeEventListener('keyup', restore);
      };
      window.addEventListener('keyup', restore);
    }
  };

  const handleDouble = () => {
    setPos((p) => (p < 50 ? 65 : 35));
  };

  const handlePos = (() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return pos;
    const margin = (8 / rect.width) * 100;
    return Math.min(Math.max(pos, margin), 100 - margin);
  })();

  return (
    <div
      className="ba-slider"
      ref={containerRef}
      onPointerDown={(e) => {
        if (e.target === handleRef.current) return;
        startDrag(e);
      }}
    >
      <div className="ba-after">
        <span className="ba-label after">IMPROVED</span>
        <p>{after}</p>
      </div>
      {before && (
        <div
          className="ba-before"
          style={{ clipPath: `inset(0 calc(100% - ${pos}%) 0 0)` }}
        >
          <span className="ba-label before">BEFORE</span>
          <p>{before}</p>
        </div>
      )}
          {before && (
        <>
          <div className="ba-track" style={{ left: `${pos}%` }} />
          <button
            ref={handleRef}
            className="ba-handle"
            style={{ left: `${handlePos}%` }}
            onPointerDown={startDrag}
            onKeyDown={handleKey}
            onDoubleClick={handleDouble}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-label="Comparison slider"
            aria-valuetext={`Showing ${Math.round(pos)}% original, ${100 - Math.round(pos)}% improved`}
          />
        </>
      )}
    </div>
  );
}
