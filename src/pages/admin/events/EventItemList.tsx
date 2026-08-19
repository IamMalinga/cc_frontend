import { JSX, useState } from 'react';
import { Form } from 'react-bootstrap';
import AdminDataTable, { ActiveBadge, type AdminColumn } from '../../../components/admin/AdminDataTable';
import { useGetAllEventItemsPagedQuery, useDeleteEventItemMutation } from '../../../api/adminApi';
import type { EventItemDto, EventCategory } from '../../../api/types';

const columns: AdminColumn<EventItemDto>[] = [
  { key: 'title', label: 'Title' },
  { key: 'eventDate', label: 'Date', render: (row) => new Date(row.eventDate).toLocaleDateString() },
  { key: 'category', label: 'Category' },
  { key: 'images', label: 'Photos', render: (row) => row.images.length },
  { key: 'attachments', label: 'Files', render: (row) => row.attachments.length },
  { key: 'active', label: 'Status', render: (row) => <ActiveBadge active={row.active} /> },
];

export default function EventItemList(): JSX.Element {
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<EventCategory | ''>('');
  const { data, isLoading, isError } = useGetAllEventItemsPagedQuery({
    page,
    size: 10,
    category: category || undefined,
  });
  const [deleteEventItem, { isLoading: isDeleting }] = useDeleteEventItemMutation();

  return (
    <AdminDataTable
      title="CC Events"
      basePath="/admin/events"
      columns={columns}
      data={data?.content ?? []}
      isLoading={isLoading}
      isError={isError}
      isDeleting={isDeleting}
      onDelete={(id) => deleteEventItem(id)}
      pagination={data ? { page, totalPages: data.totalPages, onPageChange: setPage } : undefined}
      headerExtra={
        <Form.Select
          size="sm"
          style={{ width: 180 }}
          value={category}
          onChange={(e) => {
            setPage(0);
            setCategory(e.target.value as EventCategory | '');
          }}
        >
          <option value="">All categories</option>
          <option value="STAFF">Staff Events</option>
          <option value="STUDENT">Student Events</option>
        </Form.Select>
      }
    />
  );
}
