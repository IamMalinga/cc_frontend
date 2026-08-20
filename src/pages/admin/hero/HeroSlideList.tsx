import AdminDataTable, { ActiveBadge, type AdminColumn } from '../../../components/admin/AdminDataTable';
import { useGetAllHeroSlidesQuery, useDeleteHeroSlideMutation } from '../../../api/adminApi';
import type { HeroSlideDto } from '../../../api/types';
import { JSX } from 'react/jsx-runtime';

const columns: AdminColumn<HeroSlideDto>[] = [
  { key: 'displayOrder', label: 'Order' },
  { key: 'title', label: 'Title' },
  { key: 'ctaText', label: 'CTA' },
  { key: 'active', label: 'Status', render: (row) => <ActiveBadge active={row.active} /> },
];

export default function HeroSlideList(): JSX.Element {
  const { data = [], isLoading, isError } = useGetAllHeroSlidesQuery();
  const [deleteHeroSlide, { isLoading: isDeleting }] = useDeleteHeroSlideMutation();

  const sorted = [...data].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <AdminDataTable
      title="Hero Slides"
      basePath="/admin/hero"
      columns={columns}
      data={sorted}
      isLoading={isLoading}
      isError={isError}
      isDeleting={isDeleting}
      onDelete={(id) => deleteHeroSlide(id)}
    />
  );
}
