const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const envPath = path.join(__dirname, '..', '.env');
const username = 'admin';
const password = crypto.randomBytes(12).toString('base64').replace(/[+/=]/g, '');

async function main() {
  const hash = await bcrypt.hash(password, 10);
  const jwtSecret = crypto.randomBytes(32).toString('hex');

  let env = fs.readFileSync(envPath, 'utf-8');
  const setVar = (content, key, value) => {
    const line = `${key}=${value}`;
    return content.includes(`${key}=`)
      ? content.replace(new RegExp(`^${key}=.*$`, 'm'), line)
      : `${content.trimEnd()}\n${line}\n`;
  };

  env = setVar(env, 'ADMIN_USERNAME', username);
  env = setVar(env, 'ADMIN_PASSWORD_HASH', hash);
  env = setVar(env, 'JWT_SECRET', jwtSecret);
  fs.writeFileSync(envPath, env);

  console.log('Admin credentials written to server/.env');
  console.log(`  Username: ${username}`);
  console.log(`  Password: ${password}`);
  console.log('Save this password now — it is not stored anywhere in plain text.');
}

main();
