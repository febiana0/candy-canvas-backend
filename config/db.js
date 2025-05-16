const oracledb = require('oracledb');
require('dotenv').config();

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });
    return connection;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

module.exports = {
  getConnection
};
