import { HttpResponse } from '../types/commonTypes';
import { RequestOptions } from '../types/commonTypes';

export const sendHttpRequest = async <T = any>(options: RequestOptions): Promise<HttpResponse<T>> => {
  const { method, url, headers = {}, params = {}, body } = options;
  const query = new URLSearchParams(params).toString();
  const fullUrl = query ? `${url}?${query}` : url;

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  });
  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json') ? await response.json() : await response.text();

  const httpResponse: HttpResponse<T> = {
    status: response.status,
    ok: response.ok,
    data: data as T,
  };

  await window.ipcRenderer.invoke('save-request-to-history', {
    method: 'GET',
    url: 'https://api.example.com/users',
    headers: { Authorization: 'Bearer token' },
    body: '',
    status: 200,
    ok: true,
    response_data: { message: 'Success' },
  });

  return httpResponse;
};
