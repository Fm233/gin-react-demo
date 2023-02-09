import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Video", "Auth"],
  endpoints: (builder) => ({
    getCount: builder.query({
      query: () => "/count",
    }),
    getApply: builder.query({
      query: (id) => `/apply/${id}`,
      providesTags: ["Video"],
    }),
    postApply: builder.mutation({
      query: (body) => ({
        url: "/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Video"],
    }),
    getBoard: builder.query({
      query: () => "/board",
      providesTags: ["Video"],
    }),
    getAudit: builder.query({
      query: () => "/audit",
      providesTags: ["Video", "Auth"],
    }),
    postAudit: builder.mutation({
      query: (body) => ({
        url: `/audit/${body.id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Video"],
    }),
    getAuth: builder.query({
      query: () => "/auth/check",
      providesTags: ["Auth"],
    }),
    postAuth: builder.mutation({
      query: (body) => ({
        url: `/auth`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetCountQuery,
  useGetApplyQuery,
  usePostApplyMutation,
  useGetAuditQuery,
  useGetBoardQuery,
  usePostAuditMutation,
  useGetAuthQuery,
  usePostAuthMutation,
} = apiSlice;
