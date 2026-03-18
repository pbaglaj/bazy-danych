const { Sequelize } = require('sequelize');

require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const connectionString = environment === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DEV_DATABASE_URL;

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false,
});

module.exports = sequelize;
