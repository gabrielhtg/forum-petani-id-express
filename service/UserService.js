const pool = require("../config/database");
const bcrypt = require("bcrypt");

// Fungsi untuk mendapatkan semua user
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return res.status(200).json({ data: rows });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Gagal untuk mendapatkan users!" });
    }
};

// Fungsi untuk membuat user baru
const create = async (req, res) => {
    const { name, pekerjaan, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [user] = await pool.query(`SELECT * FROM users WHERE username = '${username}'`);
        if (user.length > 0) {
            return res.status(400).json({
                status: 400,
                data: `User dengan username ${username} sudah terdaftar sebelumnya!`,
            });
        }

        const [rows] = await pool.query(`
            INSERT INTO users (name, pekerjaan, username, email, password)
            VALUES ('${name}', '${pekerjaan}', '${username}', '${email}', '${hashedPassword}') 
        `);
        return res.status(200).json({ data: `Pendaftaran berhasil!` });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error creating user" });
    }
};

// Fungsi untuk mendapatkan user berdasarkan ID
const getById = async (req, res) => {
    const id = req.params.id;

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                data: `User dengan id ${id} tidak ditemukan!`,
            });
        }
        return res.status(200).json({ status: 'ok', data: rows });
    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: "User tidak ditemukan" });
    }
};

// Fungsi untuk menghapus user berdasarkan ID
const removeUser = async (req, res) => {
    const id = req.params.id;

    try {
        const [user] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
        if (user.length === 0) {
            return res.status(404).json({
                status: 404,
                data: `User dengan id ${id} tidak ditemukan!`,
            });
        }

        await pool.query(`DELETE FROM users WHERE id = ${id}`);
        return res.status(200).json({ status: 'ok', data: user });
    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: "Gagal menghapus user. Error tidak diketahui." });
    }
};

// Fungsi untuk memperbarui data user
const updateUser = async (req, res) => {
    const id = req.params.id; // ID dari parameter URL
    const { name, pekerjaan, username, email, password, saldo } = req.body; // Data dari body request

    try {
        // Cek apakah user dengan ID tersebut ada di database
        const [user] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
        if (user.length === 0) {
            return res.status(404).json({
                status: 404,
                data: `User dengan id ${id} tidak ditemukan!`,
            });
        }

        // Jika password disediakan dalam update, hash ulang
        let hashedPassword = user[0].password; // Gunakan password lama jika tidak ada yang baru
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update data user
        await pool.query(`
            UPDATE users 
            SET name = ?, pekerjaan = ?, username = ?, email = ?, password = ?, saldo = ?, updatedAt = NOW()
            WHERE id = ?;
        `, [name, pekerjaan, username, email, hashedPassword, saldo, id]);

        return res.status(200).json({ status: "ok", message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error updating user", error });
    }
};

module.exports = {
    getAll,
    create,
    getById,
    removeUser,
    updateUser, 
};
