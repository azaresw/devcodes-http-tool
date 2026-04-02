import { RequestConfig } from "./types";
export declare function sleep(ms: number): Promise<void>;
export declare function mergeConfig(config1: RequestConfig, config2?: RequestConfig): RequestConfig;
export declare function isAbsoluteURL(url: string): boolean;
export declare function combineURLs(baseURL: string, relativeURL: string): string;
export declare function buildQueryString(params: Record<string, unknown>): string;
export declare function buildURL(config: RequestConfig): string;
export declare function serializeData(data: unknown): string | FormData | Blob | null;
export declare function parseResponseData(response: globalThis.Response, responseType?: RequestConfig["responseType"]): Promise<unknown>;
//# sourceMappingURL=utils.d.ts.map