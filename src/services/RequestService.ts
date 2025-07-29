import { HttpResponse, RequestOptions } from '../types/commonTypes';
import { SaveRequestOptions } from '../types/commonTypes';

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
      await window.ipcRenderer.invoke('delete-request', id);
      return true;
    } catch (error) {
      console.error('Failed to delete request:', error);
      return false;
    }
  }

  static async send(options: RequestOptions): Promise<HttpResponse | null> {
    const { method, url, headers = {}, params = {}, body } = options;

    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const fullUrl = query ? `${url}?${query}` : url;

      const response = await fetch(fullUrl, {
        method,
        headers,
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json') ? await response.json() : await response.text();

      const httpResponse: HttpResponse = {
        status: response.status,
        ok: response.ok,
        data,
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
    } catch (error) {
      console.error('Failed to send request:', error);
      throw error; // <- important for your `.rejects.toThrow()` test
    }
  }

  static async edit(id: string, updates: Partial<SaveRequestOptions>) {
    try {
      const result = await window.ipcRenderer.invoke('update-request', { id, updates });
      return result;
    } catch (error) {
      console.error('Failed to edit request:', error);
      return null;
    }
  }
}
