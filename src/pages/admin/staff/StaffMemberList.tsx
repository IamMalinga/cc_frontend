import { JSX, useEffect, useState, type DragEvent } from 'react';
import { Button, ListGroup, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { FaGripVertical } from 'react-icons/fa';
import AdminDataTable, { ActiveBadge, type AdminColumn } from '../../../components/admin/AdminDataTable';
import {
  useGetAllStaffMembersPagedQuery,
  useDeleteStaffMemberMutation,
  useReorderStaffMembersMutation,
} from '../../../api/adminApi';
import type { StaffMemberDto } from '../../../api/types';

const columns: AdminColumn<StaffMemberDto>[] = [
  { key: 'displayOrder', label: 'Order' },
  { key: 'name', label: 'Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'category', label: 'Category' },
  { key: 'links', label: 'Links', render: (row) => row.links.length },
  { key: 'active', label: 'Status', render: (row) => <ActiveBadge active={row.active} /> },
];

/** Drag-and-drop reordering across the *entire* staff list (not just the current page). */
function ReorderPanel({ onClose }: { onClose: () => void }): JSX.Element {
  // A large page size pulls the full list in one call so drag order isn't
  // scoped to a single page - reordering across pages wouldn't make sense.
  const { data, isLoading, isError } = useGetAllStaffMembersPagedQuery({ page: 0, size: 500 });
  const [reorder, { isLoading: isSaving }] = useReorderStaffMembersMutation();

  const [items, setItems] = useState<StaffMemberDto[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setItems([...data.content].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [data]);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: DragEvent<HTMLElement>, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  async function handleSave() {
    try {
      await reorder(items.map((item) => item.id)).unwrap();
      onClose();
    } catch {
      // stays open on failure so the admin can retry
    }
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0" style={{ color: '#0d2d62' }}>Reorder Staff</h5>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-secondary" onClick={onClose} type="button">Cancel</Button>
          <Button size="sm" style={{ backgroundColor: '#0d2d62', border: 'none' }} onClick={handleSave} disabled={isSaving} type="button">
            {isSaving ? 'Saving…' : 'Save Order'}
          </Button>
        </div>
      </div>

      {isLoading && <Spinner animation="border" style={{ color: '#0d2d62' }} />}
      {isError && <Alert variant="danger">Failed to load staff for reordering.</Alert>}

      {!isLoading && !isError && (
        <ListGroup>
          {items.map((item, index) => (
            <ListGroup.Item
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={() => setDragIndex(null)}
              className="d-flex align-items-center gap-3"
              style={{ cursor: 'grab' }}
            >
              <FaGripVertical className="text-muted" />
              <span className="flex-grow-1">{item.name} <span className="text-muted small">— {item.designation}</span></span>
              <Badge bg="light" text="dark">{item.category}</Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Form.Text muted className="d-block mt-2">Drag rows to reorder, then Save Order.</Form.Text>
    </div>
  );
}

export default function StaffMemberList(): JSX.Element {
  const [page, setPage] = useState(0);
  const [reordering, setReordering] = useState(false);
  const { data, isLoading, isError } = useGetAllStaffMembersPagedQuery({ page, size: 12 }, { skip: reordering });
  const [deleteStaffMember, { isLoading: isDeleting }] = useDeleteStaffMemberMutation();

  if (reordering) {
    return <ReorderPanel onClose={() => setReordering(false)} />;
  }

  return (
    <AdminDataTable
      title="Staff Members"
      basePath="/admin/staff"
      columns={columns}
      data={data?.content ?? []}
      isLoading={isLoading}
      isError={isError}
      isDeleting={isDeleting}
      onDelete={(id) => deleteStaffMember(id)}
      pagination={data ? { page, totalPages: data.totalPages, onPageChange: setPage } : undefined}
      headerExtra={
        <Button variant="outline-primary" style={{ borderColor: '#0d2d62', color: '#0d2d62' }} onClick={() => setReordering(true)}>
          Reorder
        </Button>
      }
    />
  );
}
