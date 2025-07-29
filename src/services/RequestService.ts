import { HttpResponse, RequestOptions } from '../types/commonTypes';

export class RequestService {
  static async getAll() {
    try {
      return await window.ipcRenderer.invoke('get-all-requests');
    } catch (error) {
      console.error('Failed to get requests:', error);
      return [];
    }
  }

  static async delete(id: string) {
    try {
      const result = await window.ipcRenderer.invoke('delete-request', id);
      return result;
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  }

  static async send<T = any>(options: RequestOptions): Promise<HttpResponse<T>> {
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
      method,
      url,
      headers,
      params,
      body: typeof body === 'string' ? body : JSON.stringify(body),
      status: response.status,
      ok: response.ok,
      response_data: typeof data === 'string' ? data : JSON.stringify(data),
    });

    return httpResponse;
  }
}
