const getConnection = require('../config/db');

const findByEmail = async (email) => {
  const conn = await getConnection();
  const result = await conn.execute(
    `SELECT * FROM users WHERE email = :email`,
    [email],
    { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
  );
  await conn.close();
  return result.rows[0];
};

const createUser = async ({ name, email, password, role = 'user' }) => {
  const conn = await getConnection();
  await conn.execute(
    `INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)`,
    [name, email, password, role],
    { autoCommit: true }
  );
  await conn.close();
};

module.exports = {
  findByEmail,
  createUser,
};
