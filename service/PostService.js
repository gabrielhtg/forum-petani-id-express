const pool = require("../config/database");

const getAll = async (req, res) => {
  try {
    const [rowsPosts] = await pool.query(`
       SELECT
        posts.id AS post_id,
        posts.caption,
        IFNULL(COUNT(post_likes.id), 0) AS total_likes,
        posts.created_at AS post_created_at,
        users.username,
        users.name,
        users.pekerjaan,
        users.email,
        users.foto_profil
      FROM
        posts
      JOIN
        users ON posts.uploader_id = users.username
      LEFT JOIN
        post_likes ON posts.id = post_likes.post_id
      GROUP BY
        posts.id, posts.caption, posts.created_at, users.username, users.name, users.pekerjaan, users.email, users.foto_profil
      ORDER BY
        post_created_at DESC;`);
    return res.status(200).json({ data: rowsPosts });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Gagal untuk mendapatkan posts!" });
  }
};

const getAllPicturesById = async (req, res) => {
  try {
    const id = req.params.id;

    const [rowsImages] = await pool.query(
      `SELECT * FROM post_images where post_id = '${id}'`,
    );
    return res.status(200).json({ data: rowsImages });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Gagal untuk mendapatkan posts!" });
  }
};

const create = async (req, res) => {
  const { username, caption } = req.body;

  if (!req.files) {
    return res.status(400).send("Tidak ada gambar diupload!");
  }

  const fileNames = req.files.map((file) => file.filename);

  try {
    const [user] = await pool.query(`
            SELECT * FROM users WHERE username = '${username}'
        `);

    const [updateUser] = await pool.query(`
        UPDATE users SET total_post=${user[0].total_post + 1} where username = '${username}';
    `);

    const [post] = await pool.query(`
            INSERT INTO posts (
                uploader_id,
                caption
                )
            VALUES (
                "${username}", 
                "${caption}"
                ) 
        `);

    const imageInsertQueries = fileNames.map(async (name) => {
      await pool.query(
        `
        INSERT INTO post_images (post_id, path)
        VALUES (?, ?)`,
        [post.insertId, `posts/${name}`],
      );
    });

    // Tunggu semua operasi insert gambar selesai
    await Promise.all(imageInsertQueries);

    return res.status(200).json({ data: `Post berhasil dibuat!` });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Gagal membuat post!" });
  }
};

const getById = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ${id}`);
    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        data: `Produk tidak ada!`,
      });
    }
    return res.status(200).json({ status: "ok", data: rows });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const [product] = await pool.query(
      `SELECT * FROM products WHERE id = ${id}`,
    );
    if (product.length === 0) {
      return res.status(404).json({
        status: 404,
        data: `Produk tidak ditemukan!`,
      });
    }

    await pool.query(`DELETE FROM products WHERE id = ${id}`);
    return res.status(200).json({ status: "ok", data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(404)
      .json({ message: "Gagal menghapus user. Error tidak diketahui." });
  }
};

const update = async (req, res) => {
  const id = req.params.id; // ID dari parameter URL
  const { name, pekerjaan, username, email, password, saldo } = req.body; // Data dari body request

  try {
    const [user] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        data: `User dengan id ${id} tidak ditemukan!`,
      });
    }

    let hashedPassword = user[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update data user
    await pool.query(
      `
            UPDATE users 
            SET name = ?, pekerjaan = ?, username = ?, email = ?, password = ?, saldo = ?, updatedAt = NOW()
            WHERE id = ?;
        `,
      [name, pekerjaan, username, email, hashedPassword, saldo, id],
    );

    return res
      .status(200)
      .json({ status: "ok", message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Error updating user", error });
  }
};

module.exports = {
  getAll,
  create,
  getById,
  remove,
  update,
  getAllPicturesById,
};
