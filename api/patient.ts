import { GOOGLE_API_KEY } from "@/config/google";
import { RootState } from "@/config/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type FetchPatientRes = {
  majorDimension: string;
  range: string;
  values: string[][];
};

type FetchPatientReq = {
  sheetId: string;
  range: string;
};

type AddPatientReq = {
  sheetId: string;
  range: string;
  values: string[][];
};

type UpdatePatientReq = {
  sheetId: string;
  range: string;
  values: string[][];
};

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sheets.googleapis.com/v4/spreadsheets",
    prepareHeaders: (headers, api) => {
      const state = api.getState() as RootState;
      const accessToken = state.user.accessToken;
      headers.append("Authorization", `Bearer ${accessToken}`);
    },
  }),
  tagTypes: ["Patients"],
  endpoints: (builder) => ({
    fetchPatients: builder.query<string[][], FetchPatientReq>({
      query: (data) => ({
        url: `/${data.sheetId}/values/${data.range}?key=${GOOGLE_API_KEY}`,
      }),
      transformResponse: (response: FetchPatientRes) => {
        return response.values;
      },
      providesTags: ["Patients"],
    }),
    addPatient: builder.mutation<any, AddPatientReq>({
      query: (data) => ({
        url: `/${data.sheetId}/values/${data.range}:append?valueInputOption=RAW&key=${GOOGLE_API_KEY}`,
        method: "POST",
        body: {
          values: data.values,
        },
      }),
      transformResponse: (respponse) => {
        return respponse;
      },
    }),
    updatePatient: builder.mutation<any, UpdatePatientReq>({
      query: (data) => ({
        url: `/${data.sheetId}/values/${data.range}?valueInputOption=RAW&key=${GOOGLE_API_KEY}`,
        method: "PUT",
        body: {
          values: data.values,
        },
      }),
      transformResponse: (respponse) => {
        return respponse;
      },
    }),
  }),
});

export const {
  useFetchPatientsQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useLazyFetchPatientsQuery,
} = patientApi;
