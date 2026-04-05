import { create } from 'devcodes-http-tool';
import type {
  DiscordWebhookPayload,
  DiscordEmbed,
  WebhookConfig,
  WebhookResponse,
} from './types';

export class DiscordWebhook {
  private readonly url: string;
  private readonly http: ReturnType<typeof create>;

  /**
   * @param url  Your Discord webhook URL
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

  /** Send a raw Discord webhook payload */
  async send(payload: DiscordWebhookPayload): Promise<WebhookResponse> {
    const res = await this.http.post(this.url, payload);
    return { ok: res.status >= 200 && res.status < 300, status: res.status };
  }

  /** Send a single embed, with optional extras (content, username, …) */
  async sendEmbed(
    embed: DiscordEmbed,
    extras?: Omit<DiscordWebhookPayload, 'embeds'>,
  ): Promise<WebhookResponse> {
    return this.send({ ...extras, embeds: [embed] });
  }

  /** Send multiple embeds at once (max 10 per Discord limits) */
  async sendEmbeds(
    embeds: DiscordEmbed[],
    extras?: Omit<DiscordWebhookPayload, 'embeds'>,
  ): Promise<WebhookResponse> {
    return this.send({ ...extras, embeds });
  }

  /** Send a plain text message */
  async sendText(
    content: string,
    extras?: Omit<DiscordWebhookPayload, 'content'>,
  ): Promise<WebhookResponse> {
    return this.send({ ...extras, content });
  }
}
