import { create } from 'devcodes-http-tool';
import type { SlackWebhookPayload, WebhookConfig, WebhookResponse } from './types';

export class SlackWebhook {
  private readonly url: string;
  private readonly http: ReturnType<typeof create>;

  /**
   * @param url  Your Slack incoming webhook URL
   * @param config  Optional timeout/retry settings
   */
  constructor(url: string, config: WebhookConfig = {}) {
    this.url = url;
    this.http = create({
      timeout:    config.timeout    ?? 10_000,
      retries:    config.retries    ?? 2,
      retryDelay: config.retryDelay ?? 500,
    });
  }

  /** Send a raw Slack webhook payload */
  async send(payload: SlackWebhookPayload): Promise<WebhookResponse> {
    const res = await this.http.post(this.url, payload);
    return { ok: res.status >= 200 && res.status < 300, status: res.status };
  }

  /** Send a plain text message */
  async sendText(
    text: string,
    extras?: Omit<SlackWebhookPayload, 'text'>,
  ): Promise<WebhookResponse> {
    return this.send({ ...extras, text });
  }

  /** Send a Block Kit payload */
  async sendBlocks(
    blocks: unknown[],
    extras?: Omit<SlackWebhookPayload, 'blocks'>,
  ): Promise<WebhookResponse> {
    return this.send({ ...extras, blocks });
  }
}
