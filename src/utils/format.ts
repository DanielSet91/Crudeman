import { Header } from '../types/commonTypes';
import { Param } from '../types/commonTypes';

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
