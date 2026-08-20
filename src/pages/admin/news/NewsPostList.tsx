import AdminDataTable, { ActiveBadge, type AdminColumn } from '../../../components/admin/AdminDataTable';
import { useGetAllNewsPostsQuery, useDeleteNewsPostMutation } from '../../../api/adminApi';
import type { NewsPostDto } from '../../../api/types';
import { JSX } from 'react/jsx-runtime';

const columns: AdminColumn<NewsPostDto>[] = [
  { key: 'title', label: 'Title' },
  { key: 'publishedDate', label: 'Published', render: (row) => new Date(row.publishedDate).toLocaleDateString() },
  { key: 'pinned', label: 'Pinned', render: (row) => (row.pinned ? 'Yes' : 'No') },
  { key: 'active', label: 'Status', render: (row) => <ActiveBadge active={row.active} /> },
];

export default function NewsPostList(): JSX.Element {
  const { data = [], isLoading, isError } = useGetAllNewsPostsQuery();
  const [deleteNewsPost, { isLoading: isDeleting }] = useDeleteNewsPostMutation();

  const sorted = [...data].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return (
    <AdminDataTable
      title="News"
      basePath="/admin/news"
      columns={columns}
      data={sorted}
      isLoading={isLoading}
      isError={isError}
      isDeleting={isDeleting}
      onDelete={(id) => deleteNewsPost(id)}
    />
  );
}
