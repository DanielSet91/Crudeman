import { HttpResponse } from "../types/commonTypes";
import { RequestOptions } from "../types/commonTypes";
// import { saveRequestToHistory } from "../../electron/database/db";

export const sendHttpRequest = async <T=any>(options: RequestOptions): Promise<HttpResponse<T>> => {
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

  // saveRequestToHistory({
  //   method,
  //   url,
  //   headers,
  //   params,
  //   body: typeof body === 'string' ? body : JSON.stringify(body),
  //   status: httpResponse.status,
  //   ok: httpResponse.ok,
  //   response_data: httpResponse.data,
  // });

  return httpResponse;
};
