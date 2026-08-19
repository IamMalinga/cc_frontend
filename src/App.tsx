import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

import Home from './pages/public/Home';
import NewsList from './pages/public/NewsList';
import NewsDetail from './pages/public/NewsDetail';
import Staff from './pages/public/Staff';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import HeroSlideList from './pages/admin/hero/HeroSlideList';
import HeroSlideForm from './pages/admin/hero/HeroSlideForm';
import NewsPostList from './pages/admin/news/NewsPostList';
import NewsPostForm from './pages/admin/news/NewsPostForm';
import StaffMemberList from './pages/admin/staff/StaffMemberList';
import StaffMemberForm from './pages/admin/staff/StaffMemberForm';
import History from './pages/public/History';
import Labs from './pages/public/Labs';
import { JSX } from 'react/jsx-runtime';
import Policy from './pages/public/Policy';
import LabReservation from './pages/public/LabReservation';
import GuestWifi from './pages/public/GuestWifi';
import VacancyList from './pages/admin/vacancies/VacancyList';
import VacancyForm from './pages/admin/vacancies/VacancyForm';
import EventItemList from './pages/admin/events/EventItemList';
import EventItemForm from './pages/admin/events/EventItemForm';
import PastDirectorList from './pages/admin/directors/PastDirectorList';
import PastDirectorForm from './pages/admin/directors/PastDirectorForm';
import Vacancies from './pages/public/Vacancies';
import VacancyDetail from './pages/public/VacancyDetail';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import PastDirectors from './pages/public/PastDirectors';

export default function App(): JSX.Element {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/history" element={<History />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/vacancies" element={<Vacancies />} />
        <Route path="/vacancies/:id" element={<VacancyDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/student" element={<Events />} />
        <Route path="/events/staff" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/services/lab-reservation" element={<LabReservation />} />
        <Route path="/services/wifi" element={<GuestWifi />} />
        <Route path="/directors" element={<PastDirectors />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin panel - everything here requires an authenticated ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="hero" element={<HeroSlideList />} />
        <Route path="hero/new" element={<HeroSlideForm />} />
        <Route path="hero/:id/edit" element={<HeroSlideForm />} />

        <Route path="news" element={<NewsPostList />} />
        <Route path="news/new" element={<NewsPostForm />} />
        <Route path="news/:id/edit" element={<NewsPostForm />} />

        <Route path="staff" element={<StaffMemberList />} />
        <Route path="staff/new" element={<StaffMemberForm />} />
        <Route path="staff/:id/edit" element={<StaffMemberForm />} />

        <Route path="vacancies" element={<VacancyList />} />
        <Route path="vacancies/new" element={<VacancyForm />} />
        <Route path="vacancies/:id/edit" element={<VacancyForm />} />

        <Route path="events" element={<EventItemList />} />
        <Route path="events/new" element={<EventItemForm />} />
        <Route path="events/:id/edit" element={<EventItemForm />} />

        <Route path="directors" element={<PastDirectorList />} />
        <Route path="directors/new" element={<PastDirectorForm />} />
        <Route path="directors/:id/edit" element={<PastDirectorForm />} />
      </Route>
    </Routes>
  );
}
