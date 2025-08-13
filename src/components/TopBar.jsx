import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faRotateLeft, faStar, faEye } from '@fortawesome/free-solid-svg-icons';

export default function TopBar({ onPrint, onReset, onDefault, recruiterMode, onToggleRecruiter }) {
  return (
    <div className="topbar">
      <div className="left">
        <h2>Resume Builder</h2>
      </div>
      <div className="right">
        <button type="button" className={`btn ghost ${recruiterMode ? 'active' : ''}`} onClick={onToggleRecruiter} title="Toggle recruiter view">
          <FontAwesomeIcon icon={faEye} /> Recruiter View
        </button>
        <button type="button" className="btn ghost" onClick={onDefault} title="Load sample data">
          <FontAwesomeIcon icon={faStar} /> Sample
        </button>
        <button type="button" className="btn ghost" onClick={onReset} title="Clear all fields">
          <FontAwesomeIcon icon={faRotateLeft} /> Reset
        </button>
        <button type="button" className="btn primary" onClick={onPrint} title="Print / Save PDF">
          <FontAwesomeIcon icon={faPrint} /> Print
        </button>
      </div>
    </div>
  );
}