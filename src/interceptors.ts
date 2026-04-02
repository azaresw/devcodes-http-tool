/**
 * DevCodes Interceptor Manager
 */

import { Interceptor, InterceptorManager } from "./types";

export interface InterceptorManagerInternal<T> extends InterceptorManager<T> {
  executeHandlers(value: T): Promise<T>;
  executeErrorHandlers(error: unknown): Promise<unknown>;
}

export class InterceptorManagerImpl<T> implements InterceptorManagerInternal<T> {
  private handlers: (Interceptor<T> | null)[] = [];

  use(
    onFulfilled?: (value: T) => T | Promise<T>,
    onRejected?: (error: unknown) => unknown
  ): number {
    const id = this.handlers.length;
    this.handlers.push({ onFulfilled, onRejected });
    return id;
  }

  eject(id: number): void {
    if (id >= 0 && id < this.handlers.length) {
      this.handlers[id] = null;
    }
  }

  clear(): void {
    this.handlers = [];
  }

  forEach(fn: (handler: Interceptor<T>) => void): void {
    for (const handler of this.handlers) {
      if (handler !== null) fn(handler);
    }
  }

  async executeHandlers(value: T): Promise<T> {
    let result = value;
    for (const handler of this.handlers) {
      if (handler?.onFulfilled) {
        try {
          result = await handler.onFulfilled(result);
        } catch (error) {
          if (handler.onRejected) {
            result = (await handler.onRejected(error)) as T;
          } else {
            throw error;
          }
        }
      }
    }
    return result;
  }

  async executeErrorHandlers(error: unknown): Promise<unknown> {
    let current = error;
    for (const handler of this.handlers) {
      if (handler?.onRejected) {
        try {
          current = await handler.onRejected(current);
        } catch (err) {
          current = err;
        }
      }
    }
    return current;
  }
}
