/**
 * DevCodes - The Ultimate HTTP Client
 * Version 1.0.0
 *
 * A faster and better alternative to Axios with modern features,
 * optimized performance, and full TypeScript support.
 *
 * Built for the Dev Codes Discord community.
 */

import { DevCodesClient, create } from "./client";
import { DevCodesError } from "./types";

// Export types
export type {
  Method,
  RequestConfig,
  Response,
  DevCodesError,
  Interceptor,
  InterceptorManager,
} from "./types";

// Export classes
export { DevCodesClient };
export { InterceptorManagerImpl } from "./interceptors";
export { sleep } from "./utils";

export const version = '1.0.0';
export const packageName = 'devcodes-http-tool';

// Type guard for DevCodesError
export function isDevCodesError(error: unknown): error is DevCodesError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as DevCodesError).isDevCodesError === true
  );
}

// Create default instance
const devcodes = new DevCodesClient();

// Bound methods from the default instance
export const get = devcodes.get.bind(devcodes);
export const post = devcodes.post.bind(devcodes);
export const put = devcodes.put.bind(devcodes);
export const patch = devcodes.patch.bind(devcodes);
export const delete_ = devcodes.delete.bind(devcodes);
export const head = devcodes.head.bind(devcodes);
export const options = devcodes.options.bind(devcodes);
export const request = devcodes.request.bind(devcodes);

// Instance creation
export { create };

// Default export
export default {
  create,
  get,
  post,
  put,
  patch,
  delete: delete_,
  head,
  options,
  request,
  isDevCodesError,
};

