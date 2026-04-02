'use strict';

// ============================================================
//  Dev Codes — Discord Stats API
//  Node 20 · discord.js 14 · Express 4
// ============================================================

require('dotenv').config();

const path      = require('path');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const express   = require('express');
const cors      = require('cors');
const devcodes  = require('devcodes-http-tool');

// Named exports from devcodes-http-tool — our own HTTP client
const { create: dcCreate } = devcodes;

// Dedicated http instance for external API calls
const http = dcCreate({ timeout: 8000, retries: 2, retryDelay: 500 });

// ── Environment ───────────────────────────────────────────────
const {
  BOT_TOKEN,
  GUILD_ID,
  PORT        = 3001,
  CACHE_TTL_MS = 60_000,
} = process.env;

if (!BOT_TOKEN) throw new Error('Missing BOT_TOKEN in .env');
if (!GUILD_ID)  throw new Error('Missing GUILD_ID in .env');

const TTL = Number(CACHE_TTL_MS);

// ── Logging ───────────────────────────────────────────────────
const tag  = (label) => `\x1b[36m[${label}]\x1b[0m`;
const ok   = (msg)   => console.log(`${tag('✓')} ${msg}`);
const info = (msg)   => console.log(`${tag('i')} ${msg}`);
const warn = (msg)   => console.warn(`${tag('!')} \x1b[33m${msg}\x1b[0m`);
const err  = (msg)   => console.error(`${tag('✗')} \x1b[31m${msg}\x1b[0m`);

// ── Discord client ────────────────────────────────────────────
// NOTE: Server Members Intent + Presence Intent must be enabled
// in the Discord Developer Portal for this bot application.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,   // privileged — enable in Dev Portal
    GatewayIntentBits.GuildPresences, // privileged — enable in Dev Portal
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // privileged — enable in Dev Portal
  ],
});

// ── Cache ─────────────────────────────────────────────────────
let cache          = null;
let cacheTimestamp = 0;

async function refreshCache() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    // Fetch all members + presences in one call
    await guild.members.fetch({ withPresences: true });

    const members = guild.members.cache;
    const bots    = members.filter((m) => m.user.bot);
    const humans  = members.filter((m) => !m.user.bot);

    // Presence breakdown — humans only
    let online = 0, idle = 0, dnd = 0, offline = 0;
    humans.forEach((m) => {
      switch (m.presence?.status ?? 'offline') {
        case 'online':  online++;  break;
        case 'idle':    idle++;    break;
        case 'dnd':     dnd++;     break;
        default:        offline++; break;
      }
    });

    cache = {
      // Server
      id:          guild.id,
      name:        guild.name,
      description: guild.description ?? null,
      icon:        guild.iconURL({ extension: 'webp', forceStatic: false, size: 256 }),
      banner:      guild.bannerURL({ extension: 'webp', size: 1024 }) ?? null,
      splash:      guild.splashURL({ extension: 'webp', size: 1024 }) ?? null,
      vanityURL:   guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : null,
      createdAt:   guild.createdAt.toISOString(),

      // Counts
      memberCount: guild.memberCount,
      humanCount:  humans.size,
      botCount:    bots.size,

      // Presence
      presences: { online, idle, dnd, offline },

      // Bots in the server
      bots: [...bots.values()].map((m) => ({
        id:          m.user.id,
        username:    m.user.username,
        displayName: m.user.globalName ?? m.user.username,
        avatar:      m.user.displayAvatarURL({ extension: 'webp', forceStatic: false, size: 128 }),
        joinedAt:    m.joinedAt?.toISOString() ?? null,
      })),

      lastUpdated: new Date().toISOString(),
    };

    cacheTimestamp = Date.now();

    // Update bot status to reflect live member count
    client.user.setActivity(`${guild.memberCount.toLocaleString()} members`, {
      type: ActivityType.Watching,
    });

    ok(`Cache refreshed — ${humans.size} humans · ${bots.size} bots · ${online} online`);
  } catch (e) {
    err(`Cache refresh failed: ${e.message}`);
  }
}

// ── Express ───────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());

// Disable "X-Powered-By: Express" header
app.disable('x-powered-by');

// Serve the Dev Codes site at /
app.use(express.static(path.join(__dirname, '..', 'site')));

// Ensure cache is fresh before every response
async function ensureFresh(req, res, next) {
  try {
    if (!cache || Date.now() - cacheTimestamp > TTL) await refreshCache();
    if (!cache) return res.status(503).json({ success: false, error: 'Guild data unavailable — bot may not be ready yet' });
    next();
  } catch (e) {
    err(`ensureFresh error: ${e.message}`);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// Cache-Control helper
const cacheHeader = () => ({ 'Cache-Control': `public, max-age=${Math.floor(TTL / 1000)}` });

// ── Routes ────────────────────────────────────────────────────

// Full snapshot
app.get('/api/guild', ensureFresh, (_req, res) => {
  res.set(cacheHeader());
  res.json({ success: true, data: cache });
});

// Presence / member counts only
app.get('/api/stats', ensureFresh, (_req, res) => {
  const { memberCount, humanCount, botCount, presences, lastUpdated } = cache;
  res.set(cacheHeader());
  res.json({ success: true, data: { memberCount, humanCount, botCount, presences, lastUpdated } });
});

// Bot list
app.get('/api/bots', ensureFresh, (_req, res) => {
  res.set(cacheHeader());
  res.json({ success: true, data: cache.bots });
});

// Server info (name, icon, description, banner, vanity)
app.get('/api/server', ensureFresh, (_req, res) => {
  const { id, name, description, icon, banner, splash, vanityURL, createdAt, lastUpdated } = cache;
  res.set(cacheHeader());
  res.json({ success: true, data: { id, name, description, icon, banner, splash, vanityURL, createdAt, lastUpdated } });
});

// Generate a fresh Discord invite — called when site button is clicked
app.get('/api/invite', async (_req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    // Pick the first text channel the bot can create invites in
    const channel = guild.channels.cache.find(
      (c) => c.isTextBased() && c.permissionsFor(guild.members.me)?.has('CreateInstantInvite')
    );

    if (!channel) {
      return res.status(503).json({ success: false, error: 'No suitable channel found for invite' });
    }

    const invite = await channel.createInvite({
      maxAge:   86400, // 24 hours
      maxUses:  0,     // unlimited
      unique:   false, // reuse same invite if identical params exist
      reason:   'Dev Codes website join button',
    });

    ok(`Invite generated: ${invite.url}`);
    res.json({ success: true, url: invite.url });
  } catch (e) {
    err(`/api/invite failed: ${e.message}`);
    res.status(500).json({ success: false, error: 'Failed to generate invite' });
  }
});

// Health check — no cache needed
app.get('/health', (_req, res) => {
  res.json({
    status:      client.isReady() ? 'ok' : 'starting',
    botReady:    client.isReady(),
    cached:      cache !== null,
    cacheAgeMs:  cache ? Date.now() - cacheTimestamp : null,
    lastUpdated: cache?.lastUpdated ?? null,
  });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// ── Bot ready ─────────────────────────────────────────────────
client.once('clientReady', async () => {
  ok(`Bot ready — logged in as \x1b[35m${client.user.tag}\x1b[0m`);

  await refreshCache();

  // Periodic refresh
  setInterval(refreshCache, TTL);

  app.listen(Number(PORT), () => {
    console.log('');
    console.log('  \x1b[1m\x1b[36m Dev Codes API\x1b[0m');
    console.log(`  \x1b[2mhttp://localhost:${PORT}\x1b[0m`);
    console.log('');
    console.log(`  ${tag('GET')} /api/guild   full snapshot`);
    console.log(`  ${tag('GET')} /api/stats   presence counts`);
    console.log(`  ${tag('GET')} /api/bots    bot list`);
    console.log(`  ${tag('GET')} /api/server  server info`);
    console.log(`  ${tag('GET')} /api/invite  generate invite`);
    console.log(`  ${tag('GET')} /health      health check`);
    console.log('');
  });
});

client.on('guildMemberAdd',    () => refreshCache());
client.on('guildMemberRemove', () => refreshCache());
client.on('error', (e) => err(`Client error: ${e.message}`));
client.on('warn',  (w) => warn(w));

// ── Commands ──────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args    = message.content.slice(1).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  // !meme [subreddit?]
  if (command === 'meme') {
    const subreddit = args[0] || 'memes';
    const safeSubs  = ['memes', 'dankmemes', 'programmerhumor', 'me_irl', 'shitposting'];

    // Only allow known safe subreddits to prevent NSFW
    const sub = safeSubs.includes(subreddit.toLowerCase()) ? subreddit.toLowerCase() : 'memes';

    try {
      const { data } = await http.get(`https://meme-api.com/gimme/${sub}`);

      if (data.nsfw || data.spoiler) {
        // Retry once with a fresh call if NSFW comes through
        const retry = await http.get(`https://meme-api.com/gimme/${sub}`);
        if (retry.data.nsfw || retry.data.spoiler) {
          return message.reply('Couldn\'t find a safe meme right now, try again!');
        }
        Object.assign(data, retry.data);
      }

      const embed = new EmbedBuilder()
        .setTitle(data.title.length > 256 ? data.title.slice(0, 253) + '...' : data.title)
        .setURL(data.postLink)
        .setImage(data.url)
        .setColor(0x5865f2)
        .setFooter({ text: `r/${data.subreddit} • 👍 ${data.ups.toLocaleString()} • by ${data.author}` })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
      ok(`Meme served to ${message.author.tag} in #${message.channel.name}`);
    } catch (e) {
      err(`!meme failed: ${e.message}`);
      await message.reply('Couldn\'t fetch a meme right now — the API may be down. Try again!');
    }
    return;
  }

  // !ping
  if (command === 'ping') {
    const start = Date.now();
    const msg   = await message.reply('Pinging…');
    await msg.edit(`🏓 Pong! Latency: **${Date.now() - start}ms** | WS: **${client.ws.ping}ms**`);
    return;
  }

  // !devcodes
  if (command === 'devcodes' || command === 'http') {
    const { version } = require('devcodes-http-tool');
    const embed = new EmbedBuilder()
      .setTitle('📦 devcodes-http-tool')
      .setURL('https://www.npmjs.com/package/devcodes-http-tool')
      .setDescription('A fast, modern HTTP client — the Axios alternative built by Dev Codes.')
      .addFields(
        { name: 'Version',      value: `\`${version ?? '1.0.0'}\``,           inline: true },
        { name: 'Runtime deps', value: '**0**',                                inline: true },
        { name: 'Install',      value: '\`npm install devcodes\`',             inline: false },
        { name: 'Features',     value: '✓ TypeScript · ✓ Interceptors · ✓ Retry · ✓ Timeout · ✓ Node + Browser', inline: false },
      )
      .setColor(0x5865f2)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
});

info(`Connecting to Discord...`);
client.login(BOT_TOKEN);

