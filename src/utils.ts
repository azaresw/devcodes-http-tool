/**
 * DevCodes Utility Functions
 */

import { RequestConfig } from "./types";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Merge configuration objects, with config2 taking precedence
 */
export function mergeConfig(
  config1: RequestConfig,
  config2?: RequestConfig
): RequestConfig {
  if (!config2) return { ...config1 };

  return {
    ...config1,
    ...config2,
    headers: {
      ...config1.headers,
      ...config2.headers,
    },
    params: {
      ...config1.params,
      ...config2.params,
    },
  };
}

/**
 * Check if a URL is absolute
 */
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Combine a base URL and a relative URL
 */
export function combineURLs(baseURL: string, relativeURL: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}

/**
 * Build query string from params, supporting array values
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      }
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

/**
 * Build complete URL from config, combining baseURL and appending params
 */
export function buildURL(config: RequestConfig): string {
  let { url = "", baseURL = "", params } = config;

  if (baseURL && !isAbsoluteURL(url)) {
    url = combineURLs(baseURL, url);
  }

  if (params && Object.keys(params).length > 0) {
    url += buildQueryString(params);
  }

  return url;
}

/**
 * Serialize request body data
 */
export function serializeData(data: unknown): string | FormData | Blob | null {
  if (data === null || data === undefined) return null;
  if (typeof data === "string") return data;
  if (data instanceof FormData || data instanceof Blob) return data;
  if (typeof data === "object") {
    try {
      return JSON.stringify(data);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Parse fetch Response body based on responseType
 */
export async function parseResponseData(
  response: globalThis.Response,
  responseType: RequestConfig["responseType"] = "json"
): Promise<unknown> {
  switch (responseType) {
    case "arraybuffer":
      return response.arrayBuffer();
    case "blob":
      return response.blob();
    case "text":
    case "document":
    case "stream":
      return response.text();
    case "json":
    default:
      try {
        return await response.json();
      } catch {
        return response.text();
      }
  }
}
