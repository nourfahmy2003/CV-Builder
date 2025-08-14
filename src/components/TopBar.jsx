import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faRotateLeft, faStar, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function TopBar({ onPrint, onReset, onDefault, onToggleTheme, theme }) {
  return (
    <div className="topbar">
      <h2 className="title">Resume Builder</h2>
      <div className="actions">
        <button
          type="button"
          className="btn ghost icon"
          onClick={onToggleTheme}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
        <button type="button" className="btn primary" onClick={onDefault} title="Load sample data">
          <FontAwesomeIcon icon={faStar} /> Sample
        </button>
        <button type="button" className="btn primary" onClick={onReset} title="Clear all fields">
          <FontAwesomeIcon icon={faRotateLeft} /> Reset
        </button>
        <button type="button" className="btn primary" onClick={onPrint} title="Print / Save PDF">
          <FontAwesomeIcon icon={faPrint} /> Print
        </button>
      </div>
    </div>
  );
}