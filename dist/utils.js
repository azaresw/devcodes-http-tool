"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
exports.mergeConfig = mergeConfig;
exports.isAbsoluteURL = isAbsoluteURL;
exports.combineURLs = combineURLs;
exports.buildQueryString = buildQueryString;
exports.buildURL = buildURL;
exports.serializeData = serializeData;
exports.parseResponseData = parseResponseData;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function mergeConfig(config1, config2) {
    if (!config2)
        return { ...config1 };
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
function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
}
function buildQueryString(params) {
    const parts = [];
    for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined)
            continue;
        if (Array.isArray(value)) {
            for (const item of value) {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
            }
        }
        else {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
    }
    return parts.length > 0 ? `?${parts.join("&")}` : "";
}
function buildURL(config) {
    let { url = "", baseURL = "", params } = config;
    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURLs(baseURL, url);
    }
    if (params && Object.keys(params).length > 0) {
        url += buildQueryString(params);
    }
    return url;
}
function serializeData(data) {
    if (data === null || data === undefined)
        return null;
    if (typeof data === "string")
        return data;
    if (data instanceof FormData || data instanceof Blob)
        return data;
    if (typeof data === "object") {
        try {
            return JSON.stringify(data);
        }
        catch {
            return null;
        }
    }
    return null;
}
async function parseResponseData(response, responseType = "json") {
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
            }
            catch {
                return response.text();
            }
    }
}
//# sourceMappingURL=utils.js.map