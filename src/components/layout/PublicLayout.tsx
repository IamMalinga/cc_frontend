import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import Breadcrumbs from './Breadcrumbs';
import { JSX } from 'react/jsx-runtime';

export default function PublicLayout(): JSX.Element {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}