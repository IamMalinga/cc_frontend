import { Pagination } from 'react-bootstrap';
import { JSX } from 'react/jsx-runtime';

export interface PaginationBarProps {
  page: number; // 0-based current page
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Shows at most 5 page numbers around the current page, plus first/prev/next/last. */
export default function PaginationBar({ page, totalPages, onPageChange, className }: PaginationBarProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  const windowSize = 5;
  let start = Math.max(0, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize);
  start = Math.max(0, end - windowSize);

  const pages = Array.from({ length: end - start }, (_, i) => start + i);

  return (
    <Pagination className={className}>
      <Pagination.First disabled={page === 0} onClick={() => onPageChange(0)} />
      <Pagination.Prev disabled={page === 0} onClick={() => onPageChange(page - 1)} />
      {start > 0 && <Pagination.Ellipsis disabled />}
      {pages.map((p) => (
        <Pagination.Item key={p} active={p === page} onClick={() => onPageChange(p)}>
          {p + 1}
        </Pagination.Item>
      ))}
      {end < totalPages && <Pagination.Ellipsis disabled />}
      <Pagination.Next disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)} />
      <Pagination.Last disabled={page >= totalPages - 1} onClick={() => onPageChange(totalPages - 1)} />
    </Pagination>
  );
}
