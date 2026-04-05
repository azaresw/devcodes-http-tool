"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackWebhook = void 0;
const devcodes_http_tool_1 = require("devcodes-http-tool");
class SlackWebhook {
    /**
     * @param url  Your Slack incoming webhook URL
     * @param config  Optional timeout/retry settings
     */
    constructor(url, config = {}) {
        this.url = url;
        this.http = (0, devcodes_http_tool_1.create)({
            timeout: config.timeout ?? 10000,
            retries: config.retries ?? 2,
            retryDelay: config.retryDelay ?? 500,
        });
    }
    /** Send a raw Slack webhook payload */
    async send(payload) {
        const res = await this.http.post(this.url, payload);
        return { ok: res.status >= 200 && res.status < 300, status: res.status };
    }
    /** Send a plain text message */
    async sendText(text, extras) {
        return this.send({ ...extras, text });
    }
    /** Send a Block Kit payload */
    async sendBlocks(blocks, extras) {
        return this.send({ ...extras, blocks });
    }
}
exports.SlackWebhook = SlackWebhook;
//# sourceMappingURL=slack.js.map