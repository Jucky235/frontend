import { baseApiSlice } from "../apiSlice";

export interface NavigationRouteItem {
  path: string;
  title: string;
  description: string;
  keywords: string[];
}

export interface SearchRoutePayload {
  query: string;
}

export interface NavigationSearchResponse {
  matchedPath: string | null;
  confidence: number;
  reasoning: string;
  suggestedAction: string;
}

export const navigationApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchRoute: builder.mutation<NavigationSearchResponse, SearchRoutePayload>(
      {
        query: (body) => ({
          url: "/navigation/search",
          method: "POST",
          body,
        }),
        invalidatesTags: [],
      },
    ),
  }),
});

export const { useSearchRouteMutation } = navigationApiSlice;
