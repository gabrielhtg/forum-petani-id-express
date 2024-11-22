const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const generateToken = (userId, name, username) => {
    return jwt.sign({ id: userId, name: name, username: username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        const user = rows[0];
        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(401).json({ message: 'Password salah.' });
        }

        const token = generateToken(user.id, user.name, user.username);
        return res.status(200).json({
            data: {
                name: user.name,
                username: user.username,
                profile_picture: user.profile_picture,
                token: token
            },
            msg: 'ok'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Gagal login.' });
    }
};

module.exports = {
    login,
}