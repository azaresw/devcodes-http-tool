import { RequestConfig, Response, InterceptorManager } from "./types";
export declare class DevCodesClient {
    private baseConfig;
    private defaultHeaders;
    requestInterceptors: InterceptorManager<RequestConfig>;
    responseInterceptors: InterceptorManager<Response>;
    constructor(config?: RequestConfig);
    private createError;
    request<T = unknown>(config: RequestConfig): Promise<Response<T>>;
    getUri(config?: RequestConfig): string;
    get<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>>;
    post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<Response<T>>;
    put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<Response<T>>;
    patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<Response<T>>;
    delete<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>>;
    head<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>>;
    options<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>>;
}
export declare function create(config?: RequestConfig): DevCodesClient;
//# sourceMappingURL=client.d.ts.map