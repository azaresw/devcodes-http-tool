import type { SlackWebhookPayload, WebhookConfig, WebhookResponse } from './types';
export declare class SlackWebhook {
    private readonly url;
    private readonly http;
    /**
     * @param url  Your Slack incoming webhook URL
     * @param config  Optional timeout/retry settings
     */
    constructor(url: string, config?: WebhookConfig);
    /** Send a raw Slack webhook payload */
    send(payload: SlackWebhookPayload): Promise<WebhookResponse>;
    /** Send a plain text message */
    sendText(text: string, extras?: Omit<SlackWebhookPayload, 'text'>): Promise<WebhookResponse>;
    /** Send a Block Kit payload */
    sendBlocks(blocks: unknown[], extras?: Omit<SlackWebhookPayload, 'blocks'>): Promise<WebhookResponse>;
}
//# sourceMappingURL=slack.d.ts.map