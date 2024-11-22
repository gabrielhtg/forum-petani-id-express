const mysql = require('mysql2/promise');
const dotenv = require("dotenv");

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
};

const queries = [
    `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        pekerjaan varchar(100) not null,
        total_post int,
        total_jawaban int,
        foto_profil varchar(255),
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nomor_telepon VARCHAR(15),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `
    CREATE TABLE Content (
    contentId INTEGER PRIMARY KEY AUTO_INCREMENT,
    uploaderId VARCHAR(255) NOT NULL,            
    caption TEXT,                                
    gambar BLOB,                                  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP                         
);
    `
];

(async () => {
    const connection = await mysql.createConnection(config);

    try {
        console.log('Migration dimulai!');

        for (const e of queries) {
            await connection.query(e)
            console.log(`Query berhasil dieksekusi: ${e}\n`)
        }

        console.log('Migrasi berhasil!');
    } catch (error) {
        console.error('Terjadi kesalahan saat migrasi:', error);
    } finally {
        await connection.end();
    }
})();
