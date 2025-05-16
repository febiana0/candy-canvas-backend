const oracledb = require('oracledb');
const db = require('../config/db');

exports.toggleLike = async (req, res) => {
  const { user_id, news_id } = req.body;

  try {
    const connection = await db.getConnection();

    // Cek apakah like sudah ada
    const checkSql = `SELECT * FROM likes WHERE user_id = :user_id AND news_id = :news_id`;
    const checkResult = await connection.execute(checkSql, [user_id, news_id]);

    if (checkResult.rows.length > 0) {
      // Sudah ada => Hapus like (unlike)
      const deleteSql = `DELETE FROM likes WHERE user_id = :user_id AND news_id = :news_id`;
      await connection.execute(deleteSql, [user_id, news_id], { autoCommit: true });
      res.json({ message: 'Like removed' });
    } else {
      // Belum ada => Tambah like
      const insertSql = `INSERT INTO likes (user_id, news_id) VALUES (:user_id, :news_id)`;
      await connection.execute(insertSql, [user_id, news_id], { autoCommit: true });
      res.json({ message: 'Like added' });
    }

    await connection.close();
  } catch (err) {
    console.error('LIKE ERROR:', err); // tampilkan error lengkap di terminal
    res.status(500).json({ 
    message: 'Server error', 
    error: {
      message: err.message,
      errorNum: err.errorNum,
      code: err.code,
      stack: err.stack
    } 
  });
}
}
