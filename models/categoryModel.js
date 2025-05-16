const oracledb = require('oracledb');
const { getConnection } = require('../config/db');

exports.getAllCategories = async () => {
  const conn = await getConnection();
  try {
    const result = await conn.execute(`SELECT * FROM categories ORDER BY id`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    return result.rows;
  } finally {
    await conn.close();
  }
};

exports.createCategory = async (name) => {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `INSERT INTO categories (name) VALUES (:name)`,
      [name],
      { autoCommit: true }
    );
    return result;
  } finally {
    await conn.close();
  }
};

exports.updateCategory = async (id, name) => {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `UPDATE categories SET name = :name WHERE id = :id`,
      { id, name },
      { autoCommit: true }
    );
    return result;
  } finally {
    await conn.close();
  }
};

exports.deleteCategory = async (id) => {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `DELETE FROM categories WHERE id = :id`,
      [id],
      { autoCommit: true }
    );
    return result;
  } finally {
    await conn.close();
  }
};
