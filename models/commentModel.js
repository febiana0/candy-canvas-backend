const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

exports.createComment = async (userId, newsId, content) => {
  const conn = await getConnection();
  await conn.execute(
    `INSERT INTO comments (user_id, news_id, content) VALUES (:userId, :newsId, :content)`,
    [userId, newsId, content],
    { autoCommit: true }
  );
  await conn.close();
};

exports.getCommentsByNews = async (newsId) => {
  const conn = await getConnection();
  const result = await conn.execute(
    `SELECT c.id, c.content, c.created_at, u.name AS user_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.news_id = :newsId
     ORDER BY c.created_at DESC`,
    [newsId],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  await conn.close();
  return result.rows;
};

exports.updateComment = async (id, userId, content) => {
  const conn = await getConnection();
  const result = await conn.execute(
    `UPDATE comments SET content = :content WHERE id = :id AND user_id = :userId`,
    [content, id, userId],
    { autoCommit: true }
  );
  await conn.close();
  return result.rowsAffected;
};

exports.deleteComment = async (id, userId) => {
  const conn = await getConnection();
  const result = await conn.execute(
    `DELETE FROM comments WHERE id = :id AND user_id = :userId`,
    [id, userId],
    { autoCommit: true }
  );
  await conn.close();
  return result.rowsAffected;
};
