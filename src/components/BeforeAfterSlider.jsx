import { useState } from 'react';
import '../styles/ai-suggestions.css';

export default function BeforeAfterSlider({ before = '', after = '' }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba-slider">
      <div className="ba-before" style={{ width: before ? `${pos}%` : '0%' }}>
        {before && <p>{before}</p>}
      </div>
      <div className="ba-after">
        <p>{after}</p>
      </div>
      {before && (
        <input
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
