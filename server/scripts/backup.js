// Manual database backup: `npm run backup`
require('../lib/backup').backupNow('manual', { force: true }).then((dest) => {
  if (dest) console.log('✅ Backup saved:', dest);
  else console.log('⚠️ Backup did not run.');
  process.exit(0);
});
