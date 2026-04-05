import { create } from 'devcodes-http-tool';
import type { WebhookConfig, WebhookResponse } from './types';

/**
 * Send any JSON payload to any webhook URL (Discord, Slack, or custom).
 *
 * @param url     Webhook URL
 * @param payload Any JSON-serialisable object
 * @param config  Optional timeout/retry settings
 */
export async function sendWebhook(
  url: string,
  payload: unknown,
  config: WebhookConfig = {},
): Promise<WebhookResponse> {
  const http = create({
    timeout:    config.timeout    ?? 10_000,
    retries:    config.retries    ?? 2,
    retryDelay: config.retryDelay ?? 500,
  });
  const res = await http.post(url, payload);
  return { ok: res.status >= 200 && res.status < 300, status: res.status };
}
