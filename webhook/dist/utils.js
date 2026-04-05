"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWebhook = sendWebhook;
const devcodes_http_tool_1 = require("devcodes-http-tool");
/**
 * Send any JSON payload to any webhook URL (Discord, Slack, or custom).
 *
 * @param url     Webhook URL
 * @param payload Any JSON-serialisable object
 * @param config  Optional timeout/retry settings
 */
async function sendWebhook(url, payload, config = {}) {
    const http = (0, devcodes_http_tool_1.create)({
        timeout: config.timeout ?? 10000,
        retries: config.retries ?? 2,
        retryDelay: config.retryDelay ?? 500,
    });
    const res = await http.post(url, payload);
    return { ok: res.status >= 200 && res.status < 300, status: res.status };
}
//# sourceMappingURL=utils.js.map