/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useRef, useState } from 'react';
import Resume from '../sections/resume';

// Convert millimeters to pixels (96 DPI)
const mmToPx = (mm) => (mm * 96) / 25.4;

// Available content height inside the page (excluding padding and footer space)
const PAGE_CONTENT_HEIGHT = mmToPx(297 - 25 - 35); // 237mm

const ResumePreview = forwardRef(function ResumePreview({ data }, ref) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const sections = [];

    // Gather top section
    const top = container.querySelector('.top');
    if (top) sections.push(top);

    // Gather each resume section as a block to avoid splitting headings
    container.querySelectorAll('.section').forEach((section) => {
      sections.push(section);
    });

    const newPages = [];
    let currentPage = [];
    let currentHeight = 0;

    sections.forEach((node) => {
      const style = window.getComputedStyle(node);
      const blockHeight =
        node.offsetHeight +
        parseFloat(style.marginTop) +
        parseFloat(style.marginBottom);

      if (currentHeight + blockHeight > PAGE_CONTENT_HEIGHT && currentPage.length) {
        newPages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      currentPage.push(node.cloneNode(true));
      currentHeight += blockHeight;
    });

    if (currentPage.length) {
      newPages.push(currentPage);
    }

    // Convert page nodes to HTML strings
    const htmlPages = newPages.map((nodes) =>
      nodes.map((n) => n.outerHTML).join('')
    );

    setPages(htmlPages);
  }, [data]);

  return (
    <>
      {/* Hidden container for measuring content */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          top: 0,
          left: '-9999px',
          width: '210mm',
          padding: '25mm 25mm 35mm',
          boxSizing: 'border-box',
        }}
      >
        <Resume data={data} />
      </div>

      <div className="preview-container" ref={ref}>
        {pages.map((html, i) => (
          <div
            key={i}
            className="preview-paper"
            data-page={i + 1}
            data-total={pages.length}
          >
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <div className="page-footer">Page {i + 1} of {pages.length}</div>
          </div>
        ))}
      </div>
    </>
  );
});

export default ResumePreview;

