const fs = require('fs');
const path = require('path');
const db = require('./sqlite');

// Automatic safety net for order data. Takes consistent point-in-time
// snapshots of the whole database (SQLite's online backup — safe even while
// the store is writing) into server/data/backups/, keeping the most recent
// ones. This protects orders against file corruption, accidental deletion,
// or a bad restart. (It does NOT protect against total disk loss — for that,
// copy these files off-server periodically; see notes in the deploy docs.)
const BACKUP_DIR = path.join(__dirname, '../data/backups');
const KEEP = 30;              // keep the 30 most recent snapshots
const MIN_INTERVAL_MS = 30_000; // don't snapshot more than once per 30s

let lastBackup = 0;
let inFlight = false;

async function backupNow(reason = 'manual', { force = false } = {}) {
  const now = Date.now();
  if (!force && (inFlight || now - lastBackup < MIN_INTERVAL_MS)) return null;
  inFlight = true;
  try {
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const dest = path.join(BACKUP_DIR, `store-${ts}.db`);
    await db.backup(dest);
    lastBackup = Date.now();

    // Prune oldest beyond KEEP.
    const files = fs.readdirSync(BACKUP_DIR)
      .filter((f) => f.startsWith('store-') && f.endsWith('.db'))
      .sort();
    while (files.length > KEEP) {
      const old = files.shift();
      try { fs.unlinkSync(path.join(BACKUP_DIR, old)); } catch { /* ignore */ }
    }
    console.log(`💾 DB backup (${reason}): ${path.basename(dest)}`);
    return dest;
  } catch (err) {
    console.error('⚠️ DB backup failed:', err.message);
    return null;
  } finally {
    inFlight = false;
  }
}

// Fire-and-forget: one snapshot shortly after startup, then every 6 hours.
function startScheduledBackups() {
  setTimeout(() => backupNow('startup', { force: true }), 5000);
  setInterval(() => backupNow('scheduled', { force: true }), 6 * 60 * 60 * 1000).unref();
}

module.exports = { backupNow, startScheduledBackups, BACKUP_DIR };
