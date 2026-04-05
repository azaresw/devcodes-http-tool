import type { DiscordWebhookPayload, DiscordEmbed, WebhookConfig, WebhookResponse } from './types';
export declare class DiscordWebhook {
    private readonly url;
    private readonly http;
    /**
     * @param url  Your Discord webhook URL
     * @param config  Optional timeout/retry settings
     */
    constructor(url: string, config?: WebhookConfig);
    /** Send a raw Discord webhook payload */
    send(payload: DiscordWebhookPayload): Promise<WebhookResponse>;
    /** Send a single embed, with optional extras (content, username, …) */
    sendEmbed(embed: DiscordEmbed, extras?: Omit<DiscordWebhookPayload, 'embeds'>): Promise<WebhookResponse>;
    /** Send multiple embeds at once (max 10 per Discord limits) */
    sendEmbeds(embeds: DiscordEmbed[], extras?: Omit<DiscordWebhookPayload, 'embeds'>): Promise<WebhookResponse>;
    /** Send a plain text message */
    sendText(content: string, extras?: Omit<DiscordWebhookPayload, 'content'>): Promise<WebhookResponse>;
}
//# sourceMappingURL=discord.d.ts.map