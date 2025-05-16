const oracledb = require('oracledb');
const { getConnection } = require('../config/db');

// Fungsi bantu: ubah CLOB ke string
function lobToString(lob) {
  return new Promise((resolve, reject) => {
    let clobData = '';
    lob.setEncoding('utf8');

    lob.on('data', (chunk) => {
      clobData += chunk;
    });

    lob.on('end', () => {
      resolve(clobData);
    });

    lob.on('error', (err) => {
      reject(err);
    });
  });
}

// Ambil semua berita dengan optional search & category
exports.getAllNews = async ({ search, category }) => {
  const connection = await getConnection();
  try {
    let query = `SELECT * FROM news WHERE 1=1`;
    const binds = {};

    if (search) {
      query += ` AND LOWER(title) LIKE :search`;
      binds.search = `%${search.toLowerCase()}%`;
    }

    if (category) {
      query += ` AND category_id = :category`;
      binds.category = category;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    const rows = result.rows;
    for (let row of rows) {
      if (row.CONTENT && row.CONTENT instanceof oracledb.Lob) {
        row.CONTENT = await lobToString(row.CONTENT);
      }
    }

    return rows;
  } finally {
    await connection.close();
  }
};

// Ambil berita berdasarkan ID
exports.getNewsById = async (id) => {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT * FROM news WHERE id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const row = result.rows[0];
    if (row && row.CONTENT instanceof oracledb.Lob) {
      row.CONTENT = await lobToString(row.CONTENT);
    }

    return row;
  } finally {
    await connection.close();
  }
};

// Tambah berita baru
exports.createNews = async ({ title, content, category_id, image_url }) => {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO news (title, content, category_id, image_url, created_at)
       VALUES (:title, :content, :category_id, :image_url, CURRENT_TIMESTAMP)`,
      { title, content, category_id, image_url },
      { autoCommit: true }
    );
    return result;
  } finally {
    await connection.close();
  }
};

// Update berita
exports.updateNews = async (id, { title, content, category_id, image_url }) => {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE news SET title = :title, content = :content, category_id = :category_id,
       image_url = :image_url, updated_at = CURRENT_TIMESTAMP WHERE id = :id`,
      { title, content, category_id, image_url, id },
      { autoCommit: true }
    );
    return result;
  } finally {
    await connection.close();
  }
};

// Hapus berita
exports.deleteNews = async (id) => {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `DELETE FROM news WHERE id = :id`,
      [id],
      { autoCommit: true }
    );
    return result;
  } finally {
    await connection.close();
  }
};
