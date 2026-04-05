# devcodes-webhook

Send Discord and Slack webhooks with a clean, typed API — no boilerplate, built-in retries, full TypeScript support.

Built on top of [devcodes-http-tool](https://www.npmjs.com/package/devcodes-http-tool).

## Install

```bash
npm install devcodes-webhook
```

## Quick Start

```js
const { sendWebhook } = require('devcodes-webhook');

await sendWebhook('https://discord.com/api/webhooks/...', {
  content: 'Hello from devcodes-webhook!'
});
```

---

## Discord

### Basic message

```js
const { DiscordWebhook } = require('devcodes-webhook');

const hook = new DiscordWebhook('https://discord.com/api/webhooks/ID/TOKEN');

await hook.sendText('Server is back online ✅');
```

### Send an embed

```js
await hook.sendEmbed({
  title: '🚀 Deployment Complete',
  description: 'Version **1.4.2** is now live.',
  color: 0x57F287, // green
  timestamp: new Date().toISOString(),
  footer: { text: 'Dev Codes CI' },
});
```

### Send multiple embeds

```js
await hook.sendEmbeds([
  { title: 'Service A', description: '✅ Healthy', color: 0x57F287 },
  { title: 'Service B', description: '⚠️ Degraded', color: 0xFEE75C },
  { title: 'Service C', description: '❌ Down',    color: 0xED4245 },
]);
```

### Override webhook name & avatar

```js
await hook.send({
  content: 'Ping!',
  username: 'Alert Bot',
  avatar_url: 'https://example.com/avatar.png',
});
```

### Full embed example

```js
await hook.sendEmbed({
  author: {
    name: 'azaresw',
    url: 'https://github.com/azaresw',
    icon_url: 'https://github.com/azaresw.png',
  },
  title: 'New Pull Request',
  url: 'https://github.com/azaresw/repo/pull/42',
  description: 'Fix memory leak in cache layer',
  color: 0x5865F2,
  fields: [
    { name: 'Branch',   value: '`fix/cache-leak`', inline: true },
    { name: 'Status',   value: 'Open',             inline: true },
    { name: 'Changed',  value: '3 files',          inline: true },
  ],
  thumbnail: { url: 'https://github.com/azaresw.png' },
  footer:    { text: 'GitHub • devcodes-webhook' },
  timestamp: new Date().toISOString(),
});
```

---

## Slack

### Plain text

```js
const { SlackWebhook } = require('devcodes-webhook');

const hook = new SlackWebhook('https://hooks.slack.com/services/...');

await hook.sendText('Deployment finished successfully!');
```

### Block Kit

```js
await hook.sendBlocks([
  {
    type: 'header',
    text: { type: 'plain_text', text: '🚨 Alert' },
  },
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*Service:* API Gateway\n*Status:* Down' },
  },
]);
```

### Send to a specific channel

```js
await hook.send({
  text: 'Hello #dev!',
  channel: '#dev',
  icon_emoji: ':rocket:',
});
```

---

## Generic `sendWebhook`

Works with any service that accepts a JSON webhook body.

```js
const { sendWebhook } = require('devcodes-webhook');

await sendWebhook('https://your-endpoint.com/hook', {
  event: 'user.signup',
  userId: '123',
});
```

---

## TypeScript

Full type support out of the box.

```ts
import { DiscordWebhook, DiscordEmbed, WebhookConfig } from 'devcodes-webhook';

const config: WebhookConfig = { timeout: 5000, retries: 3 };
const hook = new DiscordWebhook('https://discord.com/api/webhooks/...', config);

const embed: DiscordEmbed = {
  title: 'Alert',
  description: 'Something happened.',
  color: 0xED4245,
};

await hook.sendEmbed(embed);
```

---

## API Reference

### `new DiscordWebhook(url, config?)`

| Method | Signature | Description |
|--------|-----------|-------------|
| `send` | `(payload: DiscordWebhookPayload) => Promise<WebhookResponse>` | Send a raw payload |
| `sendText` | `(content: string, extras?) => Promise<WebhookResponse>` | Send a plain text message |
| `sendEmbed` | `(embed: DiscordEmbed, extras?) => Promise<WebhookResponse>` | Send a single embed |
| `sendEmbeds` | `(embeds: DiscordEmbed[], extras?) => Promise<WebhookResponse>` | Send up to 10 embeds |

### `new SlackWebhook(url, config?)`

| Method | Signature | Description |
|--------|-----------|-------------|
| `send` | `(payload: SlackWebhookPayload) => Promise<WebhookResponse>` | Send a raw payload |
| `sendText` | `(text: string, extras?) => Promise<WebhookResponse>` | Send a plain text message |
| `sendBlocks` | `(blocks: unknown[], extras?) => Promise<WebhookResponse>` | Send Block Kit blocks |

### `sendWebhook(url, payload, config?)`

Generic function that POSTs any JSON payload to a URL.

### `WebhookConfig`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `10000` | Request timeout in ms |
| `retries` | `number` | `2` | Retry attempts on failure |
| `retryDelay` | `number` | `500` | Delay between retries in ms |

### `WebhookResponse`

```ts
interface WebhookResponse {
  ok: boolean;     // true if status 2xx
  status: number;  // HTTP status code
}
```

---

## Discord bot integration example

```js
const { DiscordWebhook } = require('devcodes-webhook');

const logs = new DiscordWebhook(process.env.LOG_WEBHOOK_URL);

client.on('guildMemberAdd', async (member) => {
  await logs.sendEmbed({
    title: '👋 New Member',
    description: `${member.user.tag} joined **${member.guild.name}**`,
    color: 0x57F287,
    thumbnail: { url: member.user.displayAvatarURL() },
    timestamp: new Date().toISOString(),
    footer: { text: `Members: ${member.guild.memberCount}` },
  });
});
```

---

## License

MIT © [azaresw](https://github.com/azaresw)

## Support

Join our Discord for help and updates: [discord.gg/ESh2Dp2xX9](https://discord.gg/ESh2Dp2xX9)
