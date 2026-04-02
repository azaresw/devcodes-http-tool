"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptorManagerImpl = void 0;
class InterceptorManagerImpl {
    constructor() {
        this.handlers = [];
    }
    use(onFulfilled, onRejected) {
        const id = this.handlers.length;
        this.handlers.push({ onFulfilled, onRejected });
        return id;
    }
    eject(id) {
        if (id >= 0 && id < this.handlers.length) {
            this.handlers[id] = null;
        }
    }
    clear() {
        this.handlers = [];
    }
    forEach(fn) {
        for (const handler of this.handlers) {
            if (handler !== null)
                fn(handler);
        }
    }
    async executeHandlers(value) {
        let result = value;
        for (const handler of this.handlers) {
            if (handler?.onFulfilled) {
                try {
                    result = await handler.onFulfilled(result);
                }
                catch (error) {
                    if (handler.onRejected) {
                        result = (await handler.onRejected(error));
                    }
                    else {
                        throw error;
                    }
                }
            }
        }
        return result;
    }
    async executeErrorHandlers(error) {
        let current = error;
        for (const handler of this.handlers) {
            if (handler?.onRejected) {
                try {
                    current = await handler.onRejected(current);
                }
                catch (err) {
                    current = err;
                }
            }
        }
        return current;
    }
}
exports.InterceptorManagerImpl = InterceptorManagerImpl;
//# sourceMappingURL=interceptors.js.map