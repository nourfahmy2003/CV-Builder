import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/forms.css';

export default function CollapsibleCard({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`card collapsible ${open ? 'open' : 'closed'}`}>
      <button
        type="button"
        className="collapse-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <h3>{title}</h3>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
      </button>
      <div className="card-body" style={{ display: open ? 'block' : 'none' }}>
        {children}
      </div>
    </div>
  );
}
