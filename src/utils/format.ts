import { Header } from '../types/commonTypes';
import { Param } from '../types/commonTypes';
import { SavedRequest, Method } from '../types/commonTypes';
import { RequestTransformer } from '../services/RequestTransformer';

export function formatHeaders(headers: Header[]) {
  const validHeaders = headers.filter((header) => Boolean(header.key) && header.enabled !== false);

  const formattedHeaders: Record<string, string> = {};

  for (const header of validHeaders) {
    formattedHeaders[header.key] = header.value;
  }

  return formattedHeaders;
}

export function formatParams(params: Param[]) {
  const validParams = params.filter((param) => Boolean(param.key));

  const formattedParams: Record<string, string> = {};

  for (const param of validParams) {
    formattedParams[param.key] = String(param.value);
  }

  return formattedParams;
}

export function getUpdatedRequestFields(
  current: SavedRequest,
  method: Method,
  url: string,
  headers: Header[],
  params: Param[],
  body: string
): Partial<SavedRequest> | null {
  let parsedBody: unknown = body;

  try {
    parsedBody = body ? JSON.parse(body) : '';
  } catch {
    alert('Body is not valid JSON');
    return null;
  }

  const updates: Partial<SavedRequest> = {};

  const updatedHeaders = RequestTransformer.headersToObject(headers);
  const updatedParams = RequestTransformer.paramsToObject(params);

  if (method !== current.method) updates.method = method;
  if (url !== current.url) updates.url = url;
  if (JSON.stringify(updatedHeaders) !== JSON.stringify(current.headers)) {
    updates.headers = updatedHeaders;
  }
  if (JSON.stringify(updatedParams) !== JSON.stringify(current.params)) {
    updates.params = updatedParams;
  }
  if (JSON.stringify(parsedBody) !== JSON.stringify(current.body)) {
    updates.body = JSON.stringify(parsedBody);
  }

  return Object.keys(updates).length > 0 ? updates : null;
}
