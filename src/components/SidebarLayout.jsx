// src/components/SidebarLayout.jsx
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/sidebar.css';
import '../styles/forms.css';
import '../styles/preview.css';

export default function SidebarLayout({ topbar, sidebar, preview }) {
  const [open, setOpen] = useState(true);
  const layoutRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // No-op
  }, []);

  return (
    <div className={`layout ${open ? 'open' : 'closed'}`} ref={layoutRef}>
      <aside className="sidebar">
        <button
          className="collapse"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle editor"
          tabIndex={0}
        >
          <FontAwesomeIcon icon={open ? faChevronLeft : faChevronRight} fixedWidth />
        </button>

        <div className="sidebar-inner">
          <div className="topbar">{topbar}</div>
          <div className="form-scroll" ref={scrollRef}>
            {sidebar}
          </div>
        </div>
      </aside>

      <main className="preview">
        {preview}
      </main>
    </div>
  );
}
