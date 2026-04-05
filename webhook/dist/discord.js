"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordWebhook = void 0;
const devcodes_http_tool_1 = require("devcodes-http-tool");
class DiscordWebhook {
    /**
     * @param url  Your Discord webhook URL
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
    /** Send a raw Discord webhook payload */
    async send(payload) {
        const res = await this.http.post(this.url, payload);
        return { ok: res.status >= 200 && res.status < 300, status: res.status };
    }
    /** Send a single embed, with optional extras (content, username, …) */
    async sendEmbed(embed, extras) {
        return this.send({ ...extras, embeds: [embed] });
    }
    /** Send multiple embeds at once (max 10 per Discord limits) */
    async sendEmbeds(embeds, extras) {
        return this.send({ ...extras, embeds });
    }
    /** Send a plain text message */
    async sendText(content, extras) {
        return this.send({ ...extras, content });
    }
}
exports.DiscordWebhook = DiscordWebhook;
//# sourceMappingURL=discord.js.map