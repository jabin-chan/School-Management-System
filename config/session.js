const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { rawPool } = require('./db');

const sessionStore = new MySQLStore(
  {
    createDatabaseTable: true,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    },
    expiration: parseInt(process.env.SESSION_MAX_AGE_MS || '86400000', 10) / 1000,
    clearExpired: true,
    checkExpirationInterval: 60 * 60 * 1000
  },
  rawPool
);

module.exports = session({
  name: process.env.SESSION_COOKIE_NAME || 'school_session',
  secret: process.env.SESSION_SECRET || 'insecure-development-secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE_MS || '86400000', 10),
    sameSite: 'lax'
  }
});
