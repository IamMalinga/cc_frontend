import { JSX, useState } from 'react';
import AdminDataTable, { ActiveBadge, type AdminColumn } from '../../../components/admin/AdminDataTable';
import { useGetAllVacanciesPagedQuery, useDeleteVacancyMutation } from '../../../api/adminApi';
import type { VacancyDto } from '../../../api/types';

const columns: AdminColumn<VacancyDto>[] = [
  { key: 'title', label: 'Title' },
  {
    key: 'closingDate',
    label: 'Closing Date',
    render: (row) => (row.closingDate ? new Date(row.closingDate).toLocaleDateString() : '—'),
  },
  { key: 'attachments', label: 'Files', render: (row) => (row.attachments?.length ?? 0) + (row.fileUrl ? 1 : 0) },
  { key: 'active', label: 'Status', render: (row) => <ActiveBadge active={row.active} /> },
];

export default function VacancyList(): JSX.Element {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useGetAllVacanciesPagedQuery({ page, size: 10 });
  const [deleteVacancy, { isLoading: isDeleting }] = useDeleteVacancyMutation();

  return (
    <AdminDataTable
      title="Vacancies"
      basePath="/admin/vacancies"
      columns={columns}
      data={data?.content ?? []}
      isLoading={isLoading}
      isError={isError}
      isDeleting={isDeleting}
      onDelete={(id) => deleteVacancy(id)}
      pagination={data ? { page, totalPages: data.totalPages, onPageChange: setPage } : undefined}
    />
  );
}
