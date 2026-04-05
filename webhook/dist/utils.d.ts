import type { WebhookConfig, WebhookResponse } from './types';
/**
 * Send any JSON payload to any webhook URL (Discord, Slack, or custom).
 *
 * @param url     Webhook URL
 * @param payload Any JSON-serialisable object
 * @param config  Optional timeout/retry settings
 */
export declare function sendWebhook(url: string, payload: unknown, config?: WebhookConfig): Promise<WebhookResponse>;
//# sourceMappingURL=utils.d.ts.map