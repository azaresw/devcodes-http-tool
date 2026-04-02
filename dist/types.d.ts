export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
export interface RequestConfig {
    url?: string;
    method?: Method;
    baseURL?: string;
    data?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    timeout?: number;
    withCredentials?: boolean;
    signal?: AbortSignal;
    auth?: {
        username: string;
        password: string;
    };
    responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
    maxRedirects?: number;
    validateStatus?: (status: number) => boolean;
    maxContentLength?: number;
    maxBodyLength?: number;
    retries?: number;
    retryDelay?: number | ((attempt: number) => number);
    retryOn?: (error: DevCodesError) => boolean;
}
export interface Response<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: RequestConfig;
    request?: Request;
}
export interface DevCodesError extends Error {
    config?: RequestConfig;
    code?: string;
    request?: Request;
    response?: Response;
    isDevCodesError: boolean;
}
export interface Interceptor<T> {
    onFulfilled?: (value: T) => T | Promise<T>;
    onRejected?: (error: unknown) => unknown;
}
export interface InterceptorManager<T> {
    use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: unknown) => unknown): number;
    eject(id: number): void;
    clear(): void;
    forEach(fn: (handler: Interceptor<T>) => void): void;
}
//# sourceMappingURL=types.d.ts.map