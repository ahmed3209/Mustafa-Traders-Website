// Generate a bcrypt hash for the admin password.
// Usage:  node scripts/hash-password.mjs "your-strong-password"
// Copy the printed hash into ADMIN_PASSWORD_HASH in .env.local
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);
