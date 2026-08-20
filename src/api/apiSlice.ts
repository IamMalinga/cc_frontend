import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ensureFreshToken, isAuthenticated } from '../auth/keycloak';

// Single RTK Query API instance. Every feature (hero, news, staff, ...)
// injects its own endpoints via apiSlice.injectEndpoints so we get one
// shared cache, one shared set of tag types, and one shared base query.
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  prepareHeaders: async (headers) => {
    if (isAuthenticated()) {
      const token = await ensureFreshToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

export type TagType =
  | 'HeroSlide'
  | 'News'
  | 'Staff'
  | 'Lab'
  | 'ServiceItem'
  | 'QuickLink'
  | 'Vacancy'
  | 'Event'
  | 'ContactInfo'
  | 'PastDirector';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'HeroSlide',
    'News',
    'Staff',
    'Lab',
    'ServiceItem',
    'QuickLink',
    'Vacancy',
    'Event',
    'ContactInfo',
    'PastDirector',
  ] satisfies TagType[],
  endpoints: () => ({}),
});
