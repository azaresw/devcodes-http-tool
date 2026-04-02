"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevCodesClient = void 0;
exports.create = create;
const interceptors_1 = require("./interceptors");
const utils_1 = require("./utils");
class DevCodesClient {
    constructor(config) {
        this.baseConfig = {
            timeout: 0,
            maxRedirects: 5,
            responseType: "json",
            validateStatus: (status) => status >= 200 && status < 300,
        };
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
        this.baseConfig = (0, utils_1.mergeConfig)(this.baseConfig, config);
        this.requestInterceptors = new interceptors_1.InterceptorManagerImpl();
        this.responseInterceptors = new interceptors_1.InterceptorManagerImpl();
    }
    createError(message, code, config, request, response) {
        const error = new Error(message);
        error.name = "DevCodesError";
        error.code = code;
        error.config = config;
        error.request = request;
        error.response = response;
        error.isDevCodesError = true;
        return error;
    }
    async request(config) {
        const finalConfig = (0, utils_1.mergeConfig)({ ...this.baseConfig, headers: { ...this.defaultHeaders } }, config);
        const url = (0, utils_1.buildURL)(finalConfig);
        if (!url) {
            throw this.createError("Request URL is required", "ERR_INVALID_URL", finalConfig);
        }
        const reqInterceptors = this.requestInterceptors;
        const processedConfig = await reqInterceptors.executeHandlers(finalConfig);
        const headers = { ...processedConfig.headers };
        if (processedConfig.auth) {
            const { username, password } = processedConfig.auth;
            headers["Authorization"] = `Basic ${btoa(`${username}:${password}`)}`;
        }
        const maxAttempts = (processedConfig.retries ?? 0) + 1;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (attempt > 0) {
                const delay = typeof processedConfig.retryDelay === "function"
                    ? processedConfig.retryDelay(attempt)
                    : (processedConfig.retryDelay ?? 1000);
                await (0, utils_1.sleep)(delay);
            }
            const controller = new AbortController();
            if (processedConfig.signal) {
                processedConfig.signal.addEventListener("abort", () => controller.abort());
            }
            let timeoutId;
            if (processedConfig.timeout && processedConfig.timeout > 0) {
                timeoutId = setTimeout(() => controller.abort(), processedConfig.timeout);
            }
            const fetchOptions = {
                method: processedConfig.method ?? "GET",
                headers,
                signal: controller.signal,
            };
            if (processedConfig.withCredentials) {
                fetchOptions.credentials = "include";
            }
            const body = (0, utils_1.serializeData)(processedConfig.data);
            if (body !== null) {
                fetchOptions.body = body;
            }
            try {
                const fetchResponse = await fetch(url, fetchOptions);
                if (timeoutId)
                    clearTimeout(timeoutId);
                const responseData = await (0, utils_1.parseResponseData)(fetchResponse, processedConfig.responseType);
                const headersObj = {};
                fetchResponse.headers.forEach((value, key) => {
                    headersObj[key] = value;
                });
                const devCodesResponse = {
                    data: responseData,
                    status: fetchResponse.status,
                    statusText: fetchResponse.statusText,
                    headers: headersObj,
                    config: processedConfig,
                };
                const validateStatus = processedConfig.validateStatus ?? ((s) => s >= 200 && s < 300);
                if (!validateStatus(fetchResponse.status)) {
                    throw this.createError(`Request failed with status code ${fetchResponse.status}`, `ERR_BAD_STATUS_${fetchResponse.status}`, processedConfig, undefined, devCodesResponse);
                }
                const respInterceptors = this.responseInterceptors;
                return (await respInterceptors.executeHandlers(devCodesResponse));
            }
            catch (error) {
                if (timeoutId)
                    clearTimeout(timeoutId);
                let devError;
                if (error instanceof Error && error.name === "AbortError") {
                    devError = this.createError("Request timeout", "ECONNABORTED", processedConfig);
                }
                else if (error.isDevCodesError) {
                    devError = error;
                }
                else {
                    devError = this.createError(error.message || "Network request failed", "ERR_NETWORK", processedConfig);
                }
                if (attempt < maxAttempts - 1) {
                    const shouldRetry = processedConfig.retryOn
                        ? processedConfig.retryOn(devError)
                        : devError.code === "ERR_NETWORK" || devError.code === "ECONNABORTED";
                    if (shouldRetry)
                        continue;
                }
                throw devError;
            }
        }
        throw this.createError("Request failed after all retry attempts", "ERR_MAX_RETRIES", finalConfig);
    }
    getUri(config) {
        return (0, utils_1.buildURL)((0, utils_1.mergeConfig)(this.baseConfig, config));
    }
    get(url, config) {
        return this.request((0, utils_1.mergeConfig)({ url, method: "GET" }, config));
    }
    post(url, data, config) {
        return this.request((0, utils_1.mergeConfig)({ url, method: "POST", data }, config));
    }
    put(url, data, config) {
        return this.request((0, utils_1.mergeConfig)({ url, method: "PUT", data }, config));
    }
    patch(url, data, config) {
        return this.request((0, utils_1.mergeConfig)({ url, method: "PATCH", data }, config));
    }
    delete(url, config) {
        return this.request((0, utils_1.mergeConfig)({ url, method: "DELETE" }, config));
    }
    head(url, config) {
        return this.request((0, utils_1.mergeConfig)({ url, method: "HEAD" }, config));
    }
    options(url, config) {
        return this.request((0, utils_1.mergeConfig)({ url, method: "OPTIONS" }, config));
    }
}
exports.DevCodesClient = DevCodesClient;
function create(config) {
    return new DevCodesClient(config);
}
//# sourceMappingURL=client.js.map