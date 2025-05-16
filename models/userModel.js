const oracledb = require('oracledb');
const db = require('../config/db');

const findByEmail = async (email) => {
  const connection = await db.getConnection();

  const result = await connection.execute(
    `SELECT * FROM users WHERE email = :email`,
    [email],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await connection.close();
  return result.rows[0];
};

const createUser = async ({ name, email, password, role }) => {
  const connection = await db.getConnection();

  await connection.execute(
    `INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)`,
    [name, email, password, role],
    { autoCommit: true }
  );

  const result = await connection.execute(
    `SELECT * FROM users WHERE email = :email`,
    [email],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await connection.close();
  return result.rows[0];

};

module.exports = { findByEmail, createUser };
