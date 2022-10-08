import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: builder => ({
        getCount: builder.query({
            query: () => '/count'
        }),
        getApply: builder.query({
            query: id => `/apply/${id}`,
            providesTags: (result, error, arg) => [{ type: 'apply', id: arg } as any],
        }),
        postApply: builder.mutation({
            query: body => ({
                url: '/apply',
                method: 'POST',
                body
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'apply', id: arg.bv } as any],
        }),
        getAudit: builder.query({
            query: () => '/audit',
            providesTags: ['audit' as any, 'auth' as any],
        }),
        postAudit: builder.mutation({
            query: body => ({
                url: `/audit/${body.id}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['audit' as any],
        }),
        getAuth: builder.query({
            query: () => '/auth/check',
            providesTags: ['auth' as any]
        }),
        postAuth: builder.mutation({
            query: body => ({
                url: `/auth`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['auth' as any],
        }),
        getOwner: builder.query({
            query: mid => `/owner/${mid}`,
            providesTags: ['auth' as any],
        }),
        getVideo: builder.query({
            query: bvid => `/video/${bvid}`,
            providesTags: ['auth' as any],
        }),
    })
})

export const {
    useGetCountQuery,
    useGetApplyQuery,
    usePostApplyMutation,
    useGetAuditQuery,
    usePostAuditMutation,
    useGetAuthQuery,
    usePostAuthMutation,
    useGetVideoQuery,
    useGetOwnerQuery,
} = apiSlice