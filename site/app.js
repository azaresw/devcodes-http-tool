/* ============================================================
   Dev Codes — Site JS
   Fetches live data from the Discord bot API (localhost:3001)
   and populates the page.
   ============================================================ */

const API = '';

// ── Nav scroll behaviour ─────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav')
    .classList.toggle('nav--scrolled', window.scrollY > 20);
}, { passive: true });

// ── Helpers ──────────────────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function fmt(n) {
  return typeof n === 'number' ? n.toLocaleString() : '—';
}

function timeAgo(iso) {
  if (!iso) return 'Unknown';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 365) return `${Math.floor(days / 365)}y ago`;
  if (days > 30)  return `${Math.floor(days / 30)}mo ago`;
  if (days > 0)   return `${days}d ago`;
  return 'Today';
}

// ── Fetch & render guild data ────────────────────────────────
async function loadGuild() {
  try {
    const res  = await fetch(`${API}/api/guild`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    const d = json.data;

    // Hero pills
    setText('heroOnline',  fmt(d.presences.online));
    setText('heroMembers', fmt(d.humanCount));
    setText('heroBots',    fmt(d.botCount));

    // Server card
    const avatarEl = document.getElementById('serverAvatar');
    if (d.icon) {
      avatarEl.innerHTML = `<img src="${d.icon}" alt="${d.name} icon" />`;
    } else {
      avatarEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.8rem">⌨️</div>`;
    }
    setText('serverName', d.name);
    setText('serverDesc', d.description || 'A Discord community for bot developers.');

    // Stats
    setText('statOnline',  fmt(d.presences.online));
    setText('statIdle',    fmt(d.presences.idle));
    setText('statDnd',     fmt(d.presences.dnd));
    setText('statOffline', fmt(d.presences.offline));
    setText('statTotal',   fmt(d.humanCount));
    setText('statBots',    fmt(d.botCount));

    // Bots
    renderBots(d.bots);
  } catch (e) {
    console.warn('[devcodes] Bot API unavailable — showing offline state.', e.message);
    renderOffline();
  }
}

function renderBots(bots) {
  const grid = document.getElementById('botsGrid');
  if (!bots || bots.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-3);font-size:0.9rem">No bots found.</p>`;
    return;
  }

  grid.innerHTML = bots.map((b) => `
    <div class="bot-card">
      <img
        class="bot-card__avatar"
        src="${b.avatar}"
        alt="${b.displayName}"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect width=%2264%22 height=%2264%22 rx=%2232%22 fill=%22%231a1a2e%22/><text x=%2232%22 y=%2240%22 text-anchor=%22middle%22 font-size=%2228%22>🤖</text></svg>'"
      />
      <div class="bot-card__info">
        <div class="bot-card__name">${escHtml(b.displayName)}</div>
        <div class="bot-card__joined">Joined ${timeAgo(b.joinedAt)}</div>
      </div>
    </div>
  `).join('');
}

function renderOffline() {
  // Fill stats with dashes
  ['statOnline','statIdle','statDnd','statOffline','statTotal','statBots',
   'heroOnline','heroMembers','heroBots'].forEach((id) => setText(id, '—'));

  setText('serverName', 'Dev Codes');
  setText('serverDesc', 'Join our Discord community for bot developers.');

  const avatarEl = document.getElementById('serverAvatar');
  avatarEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.8rem">⌨️</div>`;

  const grid = document.getElementById('botsGrid');
  grid.innerHTML = `<p style="color:var(--text-3);font-size:0.9rem;grid-column:1/-1">Bot API offline — start the bot to see live data.</p>`;
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Boot ─────────────────────────────────────────────────────
loadGuild();
// Refresh every 60 seconds
setInterval(loadGuild, 60_000);
