import { apiSlice } from './apiSlice';
import type {
  HeroSlideDto,
  NewsPostDto,
  StaffMemberDto,
  StaffCategory,
  LabDto,
  ServiceItemDto,
  QuickLinkDto,
  VacancyDto,
  EventItemDto,
  EventCategory,
  ContactInfoDto,
  PastDirectorDto,
  Page,
} from './types';

export interface NewsPageParams {
  page: number;
  size: number;
}

export interface StaffPageParams {
  category?: StaffCategory;
  page: number;
  size: number;
}

export interface VacancyPageParams {
  page: number;
  size: number;
}

export interface EventPageParams {
  category?: EventCategory;
  page: number;
  size: number;
}

// Consumed by the public website. Matches PublicContentController on the
// backend - every endpoint here is a GET under /api/public/** and requires
// no auth token.
export const publicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroSlides: builder.query<HeroSlideDto[], void>({
      query: () => '/public/hero-slides',
      providesTags: ['HeroSlide'],
    }),
    getNewsPage: builder.query<Page<NewsPostDto>, NewsPageParams>({
      query: (params) => ({ url: '/public/news', params }),
      providesTags: ['News'],
    }),
    getNewsHighlights: builder.query<NewsPostDto[], void>({
      query: () => '/public/news/highlights',
      providesTags: ['News'],
    }),
    getNewsById: builder.query<NewsPostDto, string | number>({
      query: (id) => `/public/news/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'News', id }],
    }),
    getStaffPage: builder.query<Page<StaffMemberDto>, StaffPageParams>({
      query: ({ category, page, size }) => ({
        url: '/public/staff',
        params: category ? { category, page, size } : { page, size },
      }),
      providesTags: ['Staff'],
    }),
    getLabs: builder.query<LabDto[], void>({
      query: () => '/public/labs',
      providesTags: ['Lab'],
    }),
    getServices: builder.query<ServiceItemDto[], void>({
      query: () => '/public/services',
      providesTags: ['ServiceItem'],
    }),
    getQuickLinks: builder.query<QuickLinkDto[], void>({
      query: () => '/public/quick-links',
      providesTags: ['QuickLink'],
    }),
    getVacancyPage: builder.query<Page<VacancyDto>, VacancyPageParams>({
      query: (params) => ({ url: '/public/vacancies', params }),
      providesTags: ['Vacancy'],
    }),
    getVacancyById: builder.query<VacancyDto, string | number>({
      query: (id) => `/public/vacancies/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vacancy', id }],
    }),
    getEventPage: builder.query<Page<EventItemDto>, EventPageParams>({
      query: ({ category, page, size }) => ({
        url: '/public/events',
        params: category ? { category, page, size } : { page, size },
      }),
      providesTags: ['Event'],
    }),
    getEventById: builder.query<EventItemDto, string | number>({
      query: (id) => `/public/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    getContactInfo: builder.query<ContactInfoDto, void>({
      query: () => '/public/contact-info',
      providesTags: ['ContactInfo'],
    }),
    getPastDirectors: builder.query<PastDirectorDto[], void>({
      query: () => '/public/past-directors',
      providesTags: ['PastDirector'],
    }),
  }),
});

export const {
  useGetHeroSlidesQuery,
  useGetNewsPageQuery,
  useGetNewsHighlightsQuery,
  useGetNewsByIdQuery,
  useGetStaffPageQuery,
  useGetLabsQuery,
  useGetServicesQuery,
  useGetQuickLinksQuery,
  useGetVacancyPageQuery,
  useGetVacancyByIdQuery,
  useGetEventPageQuery,
  useGetEventByIdQuery,
  useGetContactInfoQuery,
  useGetPastDirectorsQuery,
} = publicApi;
