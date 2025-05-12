const db = require('../config/db');

const findLike = async (userId, newsId) => {
  const sql = `SELECT * FROM likes WHERE user_id = :userId AND news_id = :newsId`;
  const result = await db.execute(sql, [userId, newsId]);
  return result.rows.length > 0;
};

const addLike = async (userId, newsId) => {
  const sql = `INSERT INTO likes (user_id, news_id) VALUES (:userId, :newsId)`;
  await db.execute(sql, [userId, newsId], { autoCommit: true });
};

const removeLike = async (userId, newsId) => {
  const sql = `DELETE FROM likes WHERE user_id = :userId AND news_id = :newsId`;
  await db.execute(sql, [userId, newsId], { autoCommit: true });
};

module.exports = {
  findLike,
  addLike,
  removeLike
};
