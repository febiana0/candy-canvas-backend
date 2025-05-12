const oracledb = require('oracledb');
const db = require('../config/db');

exports.toggleLike = async (req, res) => {
  const { user_id, news_id } = req.body;

  try {
    const conn = await db.getConnection();

    // Cek apakah sudah ada like
    const result = await conn.execute(
      `SELECT * FROM likes WHERE user_id = :user_id AND news_id = :news_id`,
      [user_id, news_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      // Sudah ada => hapus like (unlike)
      await conn.execute(
        `DELETE FROM likes WHERE user_id = :user_id AND news_id = :news_id`,
        [user_id, news_id],
        { autoCommit: true }
      );
      res.json({ message: 'Like removed' });
    } else {
      // Belum ada => tambahkan like
      await conn.execute(
        `INSERT INTO likes (user_id, news_id) VALUES (:user_id, :news_id)`,
        [user_id, news_id],
        { autoCommit: true }
      );
      res.json({ message: 'Like added' });
    }

    await conn.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};
