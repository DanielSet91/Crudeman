import { METHODS } from '../common/constants';

export type Header = {
  key: string;
  value: string;
  enabled?: boolean;
};

export type Param = {
  key: string;
  value: string | number;
};

export type Method = (typeof METHODS)[number];

export type RequestOptions = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
};

export interface HttpResponse {
  status: number;
  ok: boolean;
  data: unknown;
}

export type SaveRequestOptions = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
  status?: number;
  ok?: boolean;
  response_data?: unknown;
};

export type SavedRequest = SaveRequestOptions & {
  id: string;
  created_at: string;
};
