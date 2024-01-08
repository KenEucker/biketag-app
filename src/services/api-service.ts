import axios, {
  AxiosError,
  AxiosRequestConfig,
  // AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { IApiResponse } from 'src/interface/IApiResponse';

const API_BASE_URL =
  process.env.API_URL ?? 'https://jsonplaceholder.typicode.com';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

axiosClient.interceptors.request.use((config) => {
  return config;
});

export const request = async <T, D>(
  url: string,
  method: HttpMethod,
  data?: D,
  config?: AxiosRequestConfig
): Promise<[IApiResponse<T> | null, IApiResponse<T> | null]> => {
  try {
    const { data: resultData }: AxiosResponse<IApiResponse<T>> =
      await axiosClient.request({
        url,
        method,
        data: method !== HttpMethod.GET ? data : undefined,
        ...config,
      });
    return [null, resultData];
  } catch (error) {
    const axiosError = error as AxiosError<IApiResponse<T>>;
    return [axiosError?.response?.data ?? null, null];
  }
};
