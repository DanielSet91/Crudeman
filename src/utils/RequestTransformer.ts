import { Header, Param } from '../types/commonTypes';

export class RequestTransformer {
  static objectToHeaders(headersObj?: Record<string, string>): Header[] {
    if (!headersObj) return [];

    return Object.entries(headersObj).map(([key, value]) => ({
      key,
      value,
      enabled: true,
    }));
  }

  static headersToObject(headers: Header[]) {
    return Object.fromEntries(
      headers.filter((header) => header.enabled !== false && header.key).map(({ key, value }) => [key, value])
    );
  }

  static objectToParams(paramsObj?: Record<string, string>): Param[] {
    if (!paramsObj) return [];

    return Object.entries(paramsObj).map(([key, value]) => ({
      key,
      value,
    }));
  }

  static paramsToObject(params: Param[]) {
    return Object.fromEntries(params.filter((param) => param.key).map(({ key, value }) => [key, String(value)]));
  }
}
