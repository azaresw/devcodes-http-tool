export interface WebhookConfig {
    /** Request timeout in ms. Default: 10000 */
    timeout?: number;
    /** Number of retries on failure. Default: 2 */
    retries?: number;
    /** Delay between retries in ms. Default: 500 */
    retryDelay?: number;
}
export interface WebhookResponse {
    /** Whether the request was successful (2xx) */
    ok: boolean;
    /** HTTP status code */
    status: number;
}
export interface DiscordEmbedFooter {
    text: string;
    icon_url?: string;
}
export interface DiscordEmbedImage {
    url: string;
}
export interface DiscordEmbedThumbnail {
    url: string;
}
export interface DiscordEmbedAuthor {
    name: string;
    url?: string;
    icon_url?: string;
}
export interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}
export interface DiscordEmbed {
    title?: string;
    description?: string;
    url?: string;
    /** ISO8601 timestamp */
    timestamp?: string;
    /** Decimal colour value */
    color?: number;
    footer?: DiscordEmbedFooter;
    image?: DiscordEmbedImage;
    thumbnail?: DiscordEmbedThumbnail;
    author?: DiscordEmbedAuthor;
    fields?: DiscordEmbedField[];
}
export interface DiscordAllowedMentions {
    parse?: ('roles' | 'users' | 'everyone')[];
    roles?: string[];
    users?: string[];
    replied_user?: boolean;
}
export interface DiscordWebhookPayload {
    content?: string;
    username?: string;
    avatar_url?: string;
    tts?: boolean;
    embeds?: DiscordEmbed[];
    allowed_mentions?: DiscordAllowedMentions;
    /** Thread name to create (forum channels) */
    thread_name?: string;
    /** Message flags */
    flags?: number;
}
export interface SlackWebhookPayload {
    text?: string;
    username?: string;
    icon_emoji?: string;
    icon_url?: string;
    /** Override the default channel */
    channel?: string;
    /** Block Kit blocks */
    blocks?: unknown[];
    /** Legacy attachments */
    attachments?: unknown[];
    mrkdwn?: boolean;
    unfurl_links?: boolean;
    unfurl_media?: boolean;
}
//# sourceMappingURL=types.d.ts.map