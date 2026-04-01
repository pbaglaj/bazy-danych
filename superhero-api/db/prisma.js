const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const datasourceUrl = environment === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DEV_DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: datasourceUrl,
    },
  },
  log: process.env.PRISMA_LOGGING === 'true' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

module.exports = prisma;
