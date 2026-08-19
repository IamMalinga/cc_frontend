import type { apiSlice, TagType } from './apiSlice';

type Api = typeof apiSlice;

/** Fields the backend assigns - never sent on create. */
export type WithoutId<T> = Omit<T, 'id'>;

export interface AdminCrudConfig {
  apiSlice: Api;
  resourcePath: string;
  tagType: TagType;
  /** singular, camelCase - used to build endpoint keys, e.g. "heroSlide" */
  entityName: string;
  /** plural, camelCase - used for the "get all" endpoint key, e.g. "heroSlides" */
  listName: string;
}

/**
 * Generates a standard set of CRUD endpoints against /api/admin/<resourcePath>,
 * matching Admin<Entity>Controller on the backend one-for-one. Every admin
 * content type (hero slides, news, staff, and later labs, services, quick
 * links, vacancies, events) follows the same shape, so this factory is the
 * mechanical pattern to extend - call it once per resource with the right
 * generic type parameter and config.
 *
 * Note on typing: because the endpoint keys are built dynamically from
 * `config`, TypeScript can't statically name the generated hooks from this
 * call site alone (that would need literal template-typed keys). Instead,
 * adminApi.ts re-exports each generated hook with an explicit type
 * annotation matching the DTO - see that file. This keeps every *usage*
 * site (list/form pages) fully type-checked, which is what matters day to
 * day; only this shared factory itself uses a few pragmatic `any`s.
 */
export function createAdminCrudApi<TDto extends { id: number }>(config: AdminCrudConfig) {
  const { apiSlice: slice, resourcePath, tagType, entityName, listName } = config;
  const capitalized = entityName[0].toUpperCase() + entityName.slice(1);
  const listCapitalized = listName[0].toUpperCase() + listName.slice(1);

  const getAllKey = `getAll${listCapitalized}`;
  const getByIdKey = `get${capitalized}ById`;
  const createKey = `create${capitalized}`;
  const updateKey = `update${capitalized}`;
  const deleteKey = `delete${capitalized}`;

  return slice.injectEndpoints({
    endpoints: (builder: any) => ({
      [getAllKey]: builder.query({
        query: () => `/admin/${resourcePath}`,
        providesTags: (result: TDto[] = []) => [
          ...result.map((item) => ({ type: tagType, id: item.id })),
          { type: tagType, id: 'LIST' },
        ],
      }),
      [getByIdKey]: builder.query({
        query: (id: string | number) => `/admin/${resourcePath}/${id}`,
        providesTags: (_result: TDto | undefined, _error: unknown, id: string | number) => [
          { type: tagType, id },
        ],
      }),
      [createKey]: builder.mutation({
        query: (body: WithoutId<TDto>) => ({ url: `/admin/${resourcePath}`, method: 'POST', body }),
        invalidatesTags: [{ type: tagType, id: 'LIST' }],
      }),
      [updateKey]: builder.mutation({
        query: ({ id, ...body }: TDto) => ({ url: `/admin/${resourcePath}/${id}`, method: 'PUT', body }),
        invalidatesTags: (_result: TDto | undefined, _error: unknown, arg: TDto) => [
          { type: tagType, id: arg.id },
          { type: tagType, id: 'LIST' },
        ],
      }),
      [deleteKey]: builder.mutation({
        query: (id: number) => ({ url: `/admin/${resourcePath}/${id}`, method: 'DELETE' }),
        invalidatesTags: (_result: void, _error: unknown, id: number) => [
          { type: tagType, id },
          { type: tagType, id: 'LIST' },
        ],
      }),
    }),
  });
}
