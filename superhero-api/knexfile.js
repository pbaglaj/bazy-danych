require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DEV_DATABASE_URL,
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds/development' },
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds/test' },
  }
};