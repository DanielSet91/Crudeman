import { SaveRequestOptions, HttpResponse, RequestOptions, SavedRequest } from '../types/commonTypes';

/**
 * RequestService is responsible for handling HTTP requests and
 * communicating with the Electron main process via ipcRenderer.
 * It provides utilities to send, save, retrieve, edit, and delete requests.
 */
export class RequestService {
  /**
   * Fetch all saved requests from the backend (via ipcRenderer).
   *
   * @returns {Promise<SavedRequest[]>} A promise that resolves to an array of saved request objects.
   */
  static async getAll(): Promise<SavedRequest[]> {
    try {
      return await window.ipcRenderer.invoke('get-all-requests');
    } catch (error) {
      console.error('Failed to get requests:', error);
      return [];
    }
  }

  /**
   * Deletes a saved request by its ID.
   *
   * @param {string} id - The unique identifier of the request to delete.
   * @returns {Promise<boolean>} A promise that resolves to `true` if deletion succeeded, otherwise `false`.
   */
  static async delete(id: string) {
    try {
      await window.ipcRenderer.invoke('delete-request', id);
      return true;
    } catch (error) {
      console.error('Failed to delete request:', error);
      return false;
    }
  }

  /**
   * Sends an HTTP request using the provided options.
   * Also saves the request and response data to history via ipcRenderer.
   *
   * @param {RequestOptions} options - Options for the HTTP request (method, url, headers, params, body).
   * @returns {Promise<HttpResponse | null>} A promise that resolves to the HTTP response object or null if an error occurred.
   * @throws Will throw if fetch fails due to a network or runtime error.
   */
  static async send(options: RequestOptions): Promise<HttpResponse | null> {
    const { method, url, headers = {}, params = {}, body } = options;

    try {
      const query = new URLSearchParams(params).toString();
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
      throw error;
    }
  }

  /**
   * Edits a saved request by updating its fields.
   *
   * @param {string} id - The ID of the request to update.
   * @param {Partial<SaveRequestOptions>} updates - Partial object containing fields to update.
   * @returns {Promise<any>} A promise that resolves to the result of the update or null if it fails.
   */
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
