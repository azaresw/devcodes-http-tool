/**
 * DevCodes HTTP Client - Main Implementation
 */

import {
  RequestConfig,
  Response,
  DevCodesError,
  InterceptorManager,
} from "./types";
import { InterceptorManagerImpl, InterceptorManagerInternal } from "./interceptors";
import {
  buildURL,
  serializeData,
  parseResponseData,
  mergeConfig,
  sleep,
} from "./utils";

export class DevCodesClient {
  private baseConfig: RequestConfig = {
    timeout: 0,
    maxRedirects: 5,
    responseType: "json",
    validateStatus: (status) => status >= 200 && status < 300,
  };

  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  public requestInterceptors: InterceptorManager<RequestConfig>;
  public responseInterceptors: InterceptorManager<Response>;

  constructor(config?: RequestConfig) {
    this.baseConfig = mergeConfig(this.baseConfig, config);
    this.requestInterceptors = new InterceptorManagerImpl<RequestConfig>();
    this.responseInterceptors = new InterceptorManagerImpl<Response>();
  }

  private createError(
    message: string,
    code?: string,
    config?: RequestConfig,
    request?: Request,
    response?: Response
  ): DevCodesError {
    const error = new Error(message) as DevCodesError;
    error.name = "DevCodesError";
    error.code = code;
    error.config = config;
    error.request = request;
    error.response = response;
    error.isDevCodesError = true;
    return error;
  }

  async request<T = unknown>(config: RequestConfig): Promise<Response<T>> {
    const finalConfig = mergeConfig(
      { ...this.baseConfig, headers: { ...this.defaultHeaders } },
      config
    );

    const url = buildURL(finalConfig);
    if (!url) {
      throw this.createError("Request URL is required", "ERR_INVALID_URL", finalConfig);
    }

    // Apply request interceptors once — before any retry attempt
    const reqInterceptors = this.requestInterceptors as InterceptorManagerInternal<RequestConfig>;
    const processedConfig = await reqInterceptors.executeHandlers(finalConfig);

    // Build headers, applying Basic auth if provided
    const headers: Record<string, string> = { ...processedConfig.headers };
    if (processedConfig.auth) {
      const { username, password } = processedConfig.auth;
      headers["Authorization"] = `Basic ${btoa(`${username}:${password}`)}`;
    }

    const maxAttempts = (processedConfig.retries ?? 0) + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Exponential-friendly delay between retries
      if (attempt > 0) {
        const delay =
          typeof processedConfig.retryDelay === "function"
            ? processedConfig.retryDelay(attempt)
            : (processedConfig.retryDelay ?? 1000);
        await sleep(delay);
      }

      // New AbortController per attempt (a used controller cannot be reused)
      const controller = new AbortController();
      if (processedConfig.signal) {
        processedConfig.signal.addEventListener("abort", () => controller.abort());
      }

      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (processedConfig.timeout && processedConfig.timeout > 0) {
        timeoutId = setTimeout(() => controller.abort(), processedConfig.timeout);
      }

      const fetchOptions: RequestInit = {
        method: processedConfig.method ?? "GET",
        headers,
        signal: controller.signal,
      };

      if (processedConfig.withCredentials) {
        fetchOptions.credentials = "include";
      }

      const body = serializeData(processedConfig.data);
      if (body !== null) {
        fetchOptions.body = body;
      }

      try {
        const fetchResponse = await fetch(url, fetchOptions);
        if (timeoutId) clearTimeout(timeoutId);

        const responseData = await parseResponseData(fetchResponse, processedConfig.responseType);

        const headersObj: Record<string, string> = {};
        fetchResponse.headers.forEach((value, key) => {
          headersObj[key] = value;
        });

        const devCodesResponse: Response<T> = {
          data: responseData as T,
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: headersObj,
          config: processedConfig,
        };

        const validateStatus = processedConfig.validateStatus ?? ((s) => s >= 200 && s < 300);
        if (!validateStatus(fetchResponse.status)) {
          throw this.createError(
            `Request failed with status code ${fetchResponse.status}`,
            `ERR_BAD_STATUS_${fetchResponse.status}`,
            processedConfig,
            undefined,
            devCodesResponse
          );
        }

        const respInterceptors = this.responseInterceptors as InterceptorManagerInternal<Response>;
        return (await respInterceptors.executeHandlers(devCodesResponse)) as Response<T>;
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);

        let devError: DevCodesError;

        if (error instanceof Error && error.name === "AbortError") {
          devError = this.createError("Request timeout", "ECONNABORTED", processedConfig);
        } else if ((error as DevCodesError).isDevCodesError) {
          devError = error as DevCodesError;
        } else {
          devError = this.createError(
            (error as Error).message || "Network request failed",
            "ERR_NETWORK",
            processedConfig
          );
        }

        // Decide whether to retry
        if (attempt < maxAttempts - 1) {
          const shouldRetry = processedConfig.retryOn
            ? processedConfig.retryOn(devError)
            : devError.code === "ERR_NETWORK" || devError.code === "ECONNABORTED";
          if (shouldRetry) continue;
        }

        throw devError;
      }
    }

    // Unreachable, but required by TypeScript control flow
    throw this.createError("Request failed after all retry attempts", "ERR_MAX_RETRIES", finalConfig);
  }

  getUri(config?: RequestConfig): string {
    return buildURL(mergeConfig(this.baseConfig, config));
  }

  get<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>(mergeConfig({ url, method: "GET" }, config));
  }

  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>(mergeConfig({ url, method: "POST", data }, config));
  }

  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>(mergeConfig({ url, method: "PUT", data }, config));
  }

  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>(mergeConfig({ url, method: "PATCH", data }, config));
  }

  delete<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>(mergeConfig({ url, method: "DELETE" }, config));
  }

  head<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>(mergeConfig({ url, method: "HEAD" }, config));
  }

  options<T = unknown>(url: string, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>(mergeConfig({ url, method: "OPTIONS" }, config));
  }
}

export function create(config?: RequestConfig): DevCodesClient {
  return new DevCodesClient(config);
}

