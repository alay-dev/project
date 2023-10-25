import { GOOGLE_API_KEY } from "@/config/google";
import { RootState } from "@/config/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type File = {
  id: string;
  kind: string;
  name: string;
  mimeType: string;
};

type FetchFilesRes = {
  incompleteSearch: false;
  kind: string;
  files: File[];
};

type FetchSheetDetailReq = {
  sheetId: string;
};

type FetchSheetDetailRes = {
  properties: any;
  sheets: {
    properties: {
      index: number;
      sheetId: number;
      sheetType: string;
      title: string;
    };
  }[];
};

export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.googleapis.com/drive/v3",
    prepareHeaders: (headers, api) => {
      const state = api.getState() as RootState;
      const accessToken = state.user.accessToken;
      headers.append("Authorization", `Bearer ${accessToken}`);
    },
  }),
  endpoints: (builder) => ({
    fetchFiles: builder.query<FetchFilesRes, string>({
      query: () => ({
        url: `/files?q=mimeType%3D%22application%2Fvnd.google-apps.spreadsheet%22&key=${GOOGLE_API_KEY}`,
      }),
      transformResponse: (response: FetchFilesRes) => {
        return response;
      },
    }),
    fetchSheetDetail: builder.mutation<
      FetchSheetDetailRes,
      FetchSheetDetailReq
    >({
      query: (data) => ({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}?includeGridData=false&key=${GOOGLE_API_KEY}`,
      }),
      transformResponse: (response: FetchSheetDetailRes) => {
        return response;
      },
    }),
  }),
});

export const { useFetchFilesQuery, useFetchSheetDetailMutation } = filesApi;
