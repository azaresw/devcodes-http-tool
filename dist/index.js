"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.request = exports.options = exports.head = exports.delete_ = exports.patch = exports.put = exports.post = exports.get = exports.packageName = exports.version = exports.sleep = exports.InterceptorManagerImpl = exports.DevCodesClient = void 0;
exports.isDevCodesError = isDevCodesError;
const client_1 = require("./client");
Object.defineProperty(exports, "DevCodesClient", { enumerable: true, get: function () { return client_1.DevCodesClient; } });
Object.defineProperty(exports, "create", { enumerable: true, get: function () { return client_1.create; } });
var interceptors_1 = require("./interceptors");
Object.defineProperty(exports, "InterceptorManagerImpl", { enumerable: true, get: function () { return interceptors_1.InterceptorManagerImpl; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return utils_1.sleep; } });
exports.version = '1.0.0';
exports.packageName = 'devcodes-http-tool';
function isDevCodesError(error) {
    return (typeof error === "object" &&
        error !== null &&
        error.isDevCodesError === true);
}
const devcodes = new client_1.DevCodesClient();
exports.get = devcodes.get.bind(devcodes);
exports.post = devcodes.post.bind(devcodes);
exports.put = devcodes.put.bind(devcodes);
exports.patch = devcodes.patch.bind(devcodes);
exports.delete_ = devcodes.delete.bind(devcodes);
exports.head = devcodes.head.bind(devcodes);
exports.options = devcodes.options.bind(devcodes);
exports.request = devcodes.request.bind(devcodes);
exports.default = {
    create: client_1.create,
    get: exports.get,
    post: exports.post,
    put: exports.put,
    patch: exports.patch,
    delete: exports.delete_,
    head: exports.head,
    options: exports.options,
    request: exports.request,
    isDevCodesError,
};
//# sourceMappingURL=index.js.map