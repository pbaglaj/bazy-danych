// test-repo.js — test warstwy Repository w izolacji (bez serwera HTTP)
require('dotenv').config();
const repo = require('./repositories/userRepository');
const pool = require('./db');

async function main() {
  console.log('=== findAll ===');
  const all = await repo.findAll({ limit: 10, offset: 0 });
  console.table(all);

  console.log('\n=== findById(1) ===');
  const one = await repo.findById(1);
  console.log(one);

  console.log('\n=== findByEmail("anna@example.com") ===');
  const byEmail = await repo.findByEmail('anna@example.com');
  console.log(byEmail);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  pool.end();
  process.exit(1);
});
