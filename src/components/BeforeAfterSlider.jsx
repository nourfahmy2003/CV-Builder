import { useState } from 'react';
import '../styles/ai-suggestions.css';

export default function BeforeAfterSlider({ before = '', after = '' }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="ba-slider">
      {before && (
        <div className="ba-before" style={{ width: `${pos}%` }}>
          <p>{before}</p>
        </div>
      )}
      <div className="ba-after">
        <p>{after}</p>
      </div>
      {before && <div className="ba-divider" style={{ left: `${pos}%` }} />}
      {before && (
        <input
          className="ba-input"
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(e.target.value)}
        />
      )}
    </div>
  );
}
