import { Interceptor, InterceptorManager } from "./types";
export interface InterceptorManagerInternal<T> extends InterceptorManager<T> {
    executeHandlers(value: T): Promise<T>;
    executeErrorHandlers(error: unknown): Promise<unknown>;
}
export declare class InterceptorManagerImpl<T> implements InterceptorManagerInternal<T> {
    private handlers;
    use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: unknown) => unknown): number;
    eject(id: number): void;
    clear(): void;
    forEach(fn: (handler: Interceptor<T>) => void): void;
    executeHandlers(value: T): Promise<T>;
    executeErrorHandlers(error: unknown): Promise<unknown>;
}
//# sourceMappingURL=interceptors.d.ts.map