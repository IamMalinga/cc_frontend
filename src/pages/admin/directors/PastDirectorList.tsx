import AdminDataTable, { ActiveBadge, type AdminColumn } from '../../../components/admin/AdminDataTable';
import { useGetAllPastDirectorsQuery, useDeletePastDirectorMutation } from '../../../api/adminApi';
import type { PastDirectorDto } from '../../../api/types';
import { JSX } from 'react/jsx-runtime';

const columns: AdminColumn<PastDirectorDto>[] = [
  { key: 'displayOrder', label: 'Order' },
  { key: 'name', label: 'Name' },
  {
    key: 'period',
    label: 'Period',
    render: (row) =>
      `${new Date(row.periodFrom).getFullYear()} – ${row.periodTo ? new Date(row.periodTo).getFullYear() : 'Present'}`,
  },
  { key: 'active', label: 'Status', render: (row) => <ActiveBadge active={row.active} /> },
];

export default function PastDirectorList(): JSX.Element {
  const { data = [], isLoading, isError } = useGetAllPastDirectorsQuery();
  const [deletePastDirector, { isLoading: isDeleting }] = useDeletePastDirectorMutation();

  const sorted = [...data].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <AdminDataTable
      title="Past Directors"
      basePath="/admin/directors"
      columns={columns}
      data={sorted}
      isLoading={isLoading}
      isError={isError}
      isDeleting={isDeleting}
      onDelete={(id) => deletePastDirector(id)}
    />
  );
}
