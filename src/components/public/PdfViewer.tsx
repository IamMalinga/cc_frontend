import { useEffect, useRef, useState, JSX } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload,
} from 'react-icons/fa';
import './PdfViewer.scss';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PdfViewerProps {
  url: string;
  title?: string;
}

export default function PdfViewer({
  url,
  title = 'Document',
}: PdfViewerProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [status, setStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading');

  useEffect(() => {
    let cancelled = false;

    setStatus('loading');
    setPdfDoc(null);
    setNumPages(0);
    setPageNum(1);

    const loadingTask = pdfjsLib.getDocument({
      url,
    });

    loadingTask.promise
      .then((doc) => {
        if (cancelled) {
          return;
        }

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNum(1);
        setStatus('ready');
      })
      .catch((error) => {
        console.error('PDF loading error:', error);

        if (!cancelled) {
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
      loadingTask.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) {
      return;
    }

    let cancelled = false;
    let renderTask: { cancel: () => void; promise?: Promise<void> } | null = null;

    pdfDoc
      .getPage(pageNum)
      .then((page) => {
        if (cancelled) {
          return;
        }

        const canvas = canvasRef.current;

        if (!canvas) {
          return;
        }

        const viewport = page.getViewport({
          scale,
        });

        const context = canvas.getContext('2d');

        if (!context) {
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderTask = page.render({
          canvasContext: context,
          viewport,
          canvas,
        });

        return renderTask.promise;
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('PDF rendering error:', error);
        }
      });

    return () => {
      cancelled = true;

      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale]);

  if (status === 'error') {
    return (
      <div className="cc-pdf-viewer-error">
        <p>This PDF couldn't be loaded for preview.</p>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="cc-pdf-viewer-link"
        >
          Open {title} in a new tab
        </a>
      </div>
    );
  }

  return (
    <div className="cc-pdf-viewer">
      <div className="cc-pdf-toolbar">
        <div className="cc-pdf-toolbar-group">
          <button
            type="button"
            onClick={() =>
              setPageNum((p) => Math.max(1, p - 1))
            }
            disabled={pageNum <= 1}
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>

          <span className="cc-pdf-page-indicator">
            {status === 'ready'
              ? `${pageNum} / ${numPages}`
              : '…'}
          </span>

          <button
            type="button"
            onClick={() =>
              setPageNum((p) =>
                Math.min(numPages, p + 1)
              )
            }
            disabled={
              status !== 'ready' ||
              pageNum >= numPages
            }
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="cc-pdf-toolbar-group">
          <button
            type="button"
            onClick={() =>
              setScale((s) => Math.max(0.6, s - 0.2))
            }
            aria-label="Zoom out"
          >
            <FaSearchMinus />
          </button>

          <button
            type="button"
            onClick={() =>
              setScale((s) => Math.min(2.4, s + 0.2))
            }
            aria-label="Zoom in"
          >
            <FaSearchPlus />
          </button>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="cc-pdf-download-btn"
            aria-label="Download"
          >
            <FaDownload />
          </a>
        </div>
      </div>

      <div className="cc-pdf-canvas-wrapper">
        {status === 'loading' && (
          <div className="cc-pdf-loading">
            <div className="cc-pdf-spinner" />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="cc-pdf-canvas"
        />
      </div>
    </div>
  );
}