import type { JSX, ReactNode } from 'react';
import { Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PaginationBar from '../public/PaginationBar';

interface WithId {
  id: number;
}

export interface AdminColumn<TRow> {
  key: string;
  label: string;
  render?: (row: TRow) => ReactNode;
}

export interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface AdminDataTableProps<TRow extends WithId> {
  title: string;
  basePath: string;
  columns: AdminColumn<TRow>[];
  data: TRow[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  /** Present only for server-paginated resources (Vacancies, Staff, Events). */
  pagination?: AdminPaginationProps;
  /** Optional extra action rendered next to "Add New" (e.g. a reorder toggle). */
  headerExtra?: ReactNode;
}

/**
 * Generic list table for an admin CRUD resource. Pass `columns` describing
 * how to render each field, and `basePath` (e.g. "/admin/news") for the
 * edit link. Used identically across resources - new content types just
 * supply their own column config, and pass `pagination` if the backend
 * endpoint returns a Page<T> rather than a flat list.
 */
export default function AdminDataTable<TRow extends WithId>({
  title,
  basePath,
  columns,
  data,
  isLoading,
  isError,
  onDelete,
  isDeleting,
  pagination,
  headerExtra,
}: AdminDataTableProps<TRow>): JSX.Element {
  const navigate = useNavigate();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0" style={{ color: '#0d2d62' }}>{title}</h3>
        <div className="d-flex gap-2">
          {headerExtra}
          <Button style={{ backgroundColor: '#0d2d62', border: 'none' }} onClick={() => navigate(`${basePath}/new`)}>
            + Add New
          </Button>
        </div>
      </div>

      {isLoading && <Spinner animation="border" style={{ color: '#0d2d62' }} />}
      {isError && <Alert variant="danger">Failed to load data. Please try again.</Alert>}

      {!isLoading && !isError && (
        <>
          <Table striped bordered hover responsive className="bg-white">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-muted py-4">
                    No records yet — click "Add New" to create one.
                  </td>
                </tr>
              )}
              {data.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  <td>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => navigate(`${basePath}/${row.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={isDeleting}
                      onClick={() => {
                        if (window.confirm('Delete this record? This cannot be undone.')) {
                          onDelete(row.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && (
            <PaginationBar
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
              className="justify-content-center"
            />
          )}
        </>
      )}
    </div>
  );
}

export function ActiveBadge({ active }: { active: boolean }): JSX.Element {
  return <Badge bg={active ? 'success' : 'secondary'}>{active ? 'Active' : 'Inactive'}</Badge>;
}
