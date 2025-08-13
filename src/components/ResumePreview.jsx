/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useRef, useState } from 'react';
import Resume from '../sections/resume';

// Convert millimeters to pixels (96 DPI)
const mmToPx = (mm) => (mm * 96) / 25.4;

// Available content height inside the page (excluding padding and footer space)
const PAGE_CONTENT_HEIGHT = mmToPx(297 - 25 - 35); // 237mm

// Helper to measure a node's outer height including margins
const getOuterHeight = (node) => {
  const style = window.getComputedStyle(node);
  return (
    node.offsetHeight +
    parseFloat(style.marginTop || 0) +
    parseFloat(style.marginBottom || 0)
  );
};

const ResumePreview = forwardRef(function ResumePreview({ data }, ref) {
  const measureRef = useRef(null);
  const containerRef = useRef(null);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const newPages = [];
    let currentPage = [];
    let currentHeight = 0;

    const pushPage = () => {
      if (currentPage.length) {
        newPages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
    };

    const addNode = (node) => {
      currentPage.push(node.cloneNode(true));
      currentHeight += getOuterHeight(node);
    };

    // Top block (name + contact)
    const top = container.querySelector('.top');
    if (top) {
      if (getOuterHeight(top) > PAGE_CONTENT_HEIGHT && currentPage.length) {
        pushPage();
      }
      addNode(top);
    }

    // Process each resume section
    container.querySelectorAll('.section').forEach((section) => {
      const header = section.querySelector('.section-title');
      const entries = Array.from(section.children).filter(
        (child) => child !== header
      );

      entries.forEach((entry, index) => {
        const entryHeight = getOuterHeight(entry);

        if (index === 0) {
          const headerHeight = getOuterHeight(header);
          if (
            currentHeight + headerHeight + entryHeight > PAGE_CONTENT_HEIGHT &&
            currentPage.length
          ) {
            pushPage();
          }

          addNode(header);
        } else if (
          currentHeight + entryHeight > PAGE_CONTENT_HEIGHT &&
          currentPage.length
        ) {
          pushPage();
        }

        addNode(entry);
      });
    });

    pushPage();

    const htmlPages = newPages.map((nodes) =>
      nodes.map((n) => n.outerHTML).join('')
    );

    setPages(htmlPages);

    if (containerRef.current) {
      containerRef.current.classList.add('flash');
      setTimeout(() => containerRef.current && containerRef.current.classList.remove('flash'), 300);
    }
  }, [data]);

  return (
    <>
      {/* Hidden container for measuring content */}
      <div ref={measureRef} className="preview-measure">
        <Resume data={data} />
      </div>

      <div className="preview-container" ref={(el) => { containerRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}>
        {pages.map((html, i) => (
          <div
            key={i}
            className="preview-paper"
            data-total={pages.length}
          >
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        ))}
      </div>
    </>
  );
});

export default ResumePreview;

