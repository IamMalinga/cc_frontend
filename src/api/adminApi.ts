import { apiSlice } from './apiSlice';
import { createAdminCrudApi, type WithoutId } from './createAdminCrudApi';
import type {
  HeroSlideDto,
  NewsPostDto,
  StaffMemberDto,
  StaffCategory,
  VacancyDto,
  EventItemDto,
  EventCategory,
  PastDirectorDto,
  Page,
} from './types';

// --- Simple (non-paginated) admin resources use the shared factory --------

createAdminCrudApi<HeroSlideDto>({
  apiSlice,
  resourcePath: 'heroslides',
  tagType: 'HeroSlide',
  entityName: 'heroSlide',
  listName: 'heroSlides',
});

createAdminCrudApi<NewsPostDto>({
  apiSlice,
  resourcePath: 'newsposts',
  tagType: 'News',
  entityName: 'newsPost',
  listName: 'newsPosts',
});

createAdminCrudApi<PastDirectorDto>({
  apiSlice,
  resourcePath: 'pastdirectors',
  tagType: 'PastDirector',
  entityName: 'pastDirector',
  listName: 'pastDirectors',
});

// --- Vacancies, Staff, and Events are paginated and/or have nested --------
// --- child collections (attachments/links/images) or extra actions       --
// --- (reorder), so they're defined directly instead of via the factory.  --

export interface AdminPageParams {
  page: number;
  size: number;
}

export interface AdminStaffPageParams extends AdminPageParams {
  category?: StaffCategory;
}

export interface AdminEventPageParams extends AdminPageParams {
  category?: EventCategory;
}

const customAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Vacancies ---------------------------------------------------------
    getAllVacanciesPaged: builder.query<Page<VacancyDto>, AdminPageParams>({
      query: (params) => ({ url: '/admin/vacancies', params }),
      providesTags: (result) => [
        ...(result?.content ?? []).map((v) => ({ type: 'Vacancy' as const, id: v.id })),
        { type: 'Vacancy' as const, id: 'LIST' },
      ],
    }),
    getVacancyById: builder.query<VacancyDto, string | number>({
      query: (id) => `/admin/vacancies/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Vacancy', id }],
    }),
    createVacancy: builder.mutation<VacancyDto, WithoutId<VacancyDto>>({
      query: (body) => ({ url: '/admin/vacancies', method: 'POST', body }),
      invalidatesTags: [{ type: 'Vacancy', id: 'LIST' }],
    }),
    updateVacancy: builder.mutation<VacancyDto, VacancyDto>({
      query: ({ id, ...body }) => ({ url: `/admin/vacancies/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Vacancy', id: arg.id }, { type: 'Vacancy', id: 'LIST' }],
    }),
    deleteVacancy: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/vacancies/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Vacancy', id }, { type: 'Vacancy', id: 'LIST' }],
    }),

    // Staff ---------------------------------------------------------------
    getAllStaffMembersPaged: builder.query<Page<StaffMemberDto>, AdminStaffPageParams>({
      query: ({ category, page, size }) => ({
        url: '/admin/staffmembers',
        params: category ? { category, page, size } : { page, size },
      }),
      providesTags: (result) => [
        ...(result?.content ?? []).map((s) => ({ type: 'Staff' as const, id: s.id })),
        { type: 'Staff' as const, id: 'LIST' },
      ],
    }),
    getStaffMemberById: builder.query<StaffMemberDto, string | number>({
      query: (id) => `/admin/staffmembers/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Staff', id }],
    }),
    createStaffMember: builder.mutation<StaffMemberDto, WithoutId<StaffMemberDto>>({
      query: (body) => ({ url: '/admin/staffmembers', method: 'POST', body }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),
    updateStaffMember: builder.mutation<StaffMemberDto, StaffMemberDto>({
      query: ({ id, ...body }) => ({ url: `/admin/staffmembers/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Staff', id: arg.id }, { type: 'Staff', id: 'LIST' }],
    }),
    deleteStaffMember: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/staffmembers/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Staff', id }, { type: 'Staff', id: 'LIST' }],
    }),
    reorderStaffMembers: builder.mutation<void, number[]>({
      query: (orderedIds) => ({ url: '/admin/staffmembers/reorder', method: 'PUT', body: orderedIds }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),

    // Events ----------------------------------------------------------------
    getAllEventItemsPaged: builder.query<Page<EventItemDto>, AdminEventPageParams>({
      query: ({ category, page, size }) => ({
        url: '/admin/eventitems',
        params: category ? { category, page, size } : { page, size },
      }),
      providesTags: (result) => [
        ...(result?.content ?? []).map((e) => ({ type: 'Event' as const, id: e.id })),
        { type: 'Event' as const, id: 'LIST' },
      ],
    }),
    getEventItemById: builder.query<EventItemDto, string | number>({
      query: (id) => `/admin/eventitems/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Event', id }],
    }),
    createEventItem: builder.mutation<EventItemDto, WithoutId<EventItemDto>>({
      query: (body) => ({ url: '/admin/eventitems', method: 'POST', body }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    updateEventItem: builder.mutation<EventItemDto, EventItemDto>({
      query: ({ id, ...body }) => ({ url: `/admin/eventitems/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Event', id: arg.id }, { type: 'Event', id: 'LIST' }],
    }),
    deleteEventItem: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/eventitems/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),

    // Misc --------------------------------------------------------------
    getMe: builder.query<{ username: string; name: string; email: string; roles: string[] }, void>({
      query: () => '/admin/me',
    }),
    uploadFile: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({ url: '/admin/uploads', method: 'POST', body: formData }),
    }),
  }),
});

export const {
  useGetAllVacanciesPagedQuery,
  useGetVacancyByIdQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,

  useGetAllStaffMembersPagedQuery,
  useGetStaffMemberByIdQuery,
  useCreateStaffMemberMutation,
  useUpdateStaffMemberMutation,
  useDeleteStaffMemberMutation,
  useReorderStaffMembersMutation,

  useGetAllEventItemsPagedQuery,
  useGetEventItemByIdQuery,
  useCreateEventItemMutation,
  useUpdateEventItemMutation,
  useDeleteEventItemMutation,

  useGetMeQuery,
  useUploadFileMutation,
} = customAdminApi;

// ---------------------------------------------------------------------------
// Hero / PastDirector hooks come from the generic factory (see
// createAdminCrudApi.ts). Its endpoint keys are built dynamically, so
// TypeScript can't infer them at that call site - these typed re-exports
// bridge the gap. See createAdminCrudApi.ts for the key-naming scheme.
// ---------------------------------------------------------------------------

interface QueryHookResult<T> {
  data?: T;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: unknown;
  refetch: () => void;
}

type QueryHook<TArg, TData> = (arg: TArg, options?: { skip?: boolean }) => QueryHookResult<TData>;

interface MutationHookState<TData> {
  isLoading: boolean;
  isSuccess: boolean;
  error?: unknown;
  data?: TData;
}

type MutationTrigger<TArg, TData> = (arg: TArg) => { unwrap: () => Promise<TData> };
type MutationHook<TArg, TData> = () => [MutationTrigger<TArg, TData>, MutationHookState<TData>];

const rawApi = apiSlice as unknown as Record<string, unknown>;

// Hero
export const useGetAllHeroSlidesQuery = rawApi.useGetAllHeroSlidesQuery as QueryHook<void, HeroSlideDto[]>;
export const useGetHeroSlideByIdQuery = rawApi.useGetHeroSlideByIdQuery as QueryHook<string | number, HeroSlideDto>;
export const useCreateHeroSlideMutation = rawApi.useCreateHeroSlideMutation as MutationHook<WithoutId<HeroSlideDto>, HeroSlideDto>;
export const useUpdateHeroSlideMutation = rawApi.useUpdateHeroSlideMutation as MutationHook<HeroSlideDto, HeroSlideDto>;
export const useDeleteHeroSlideMutation = rawApi.useDeleteHeroSlideMutation as MutationHook<number, void>;

// News
export const useGetAllNewsPostsQuery = rawApi.useGetAllNewsPostsQuery as QueryHook<void, NewsPostDto[]>;
export const useGetNewsPostByIdQuery = rawApi.useGetNewsPostByIdQuery as QueryHook<string | number, NewsPostDto>;
export const useCreateNewsPostMutation = rawApi.useCreateNewsPostMutation as MutationHook<WithoutId<NewsPostDto>, NewsPostDto>;
export const useUpdateNewsPostMutation = rawApi.useUpdateNewsPostMutation as MutationHook<NewsPostDto, NewsPostDto>;
export const useDeleteNewsPostMutation = rawApi.useDeleteNewsPostMutation as MutationHook<number, void>;

// Past Directors
export const useGetAllPastDirectorsQuery = rawApi.useGetAllPastDirectorsQuery as QueryHook<void, PastDirectorDto[]>;
export const useGetPastDirectorByIdQuery = rawApi.useGetPastDirectorByIdQuery as QueryHook<string | number, PastDirectorDto>;
export const useCreatePastDirectorMutation = rawApi.useCreatePastDirectorMutation as MutationHook<WithoutId<PastDirectorDto>, PastDirectorDto>;
export const useUpdatePastDirectorMutation = rawApi.useUpdatePastDirectorMutation as MutationHook<PastDirectorDto, PastDirectorDto>;
export const useDeletePastDirectorMutation = rawApi.useDeletePastDirectorMutation as MutationHook<number, void>;
