export interface IApiResponse<T> {
  data?: T;
  message?: string | Record<string, string>;
  code?: number;
  status?: boolean;
  timestamp?: string;
}
