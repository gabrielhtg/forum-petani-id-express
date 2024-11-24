const mysql = require('mysql2/promise');
const dotenv = require("dotenv");

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
};

const queries = [
    `DROP DATABASE forum_tani_id`,
    `CREATE DATABASE forum_tani_id`,
    `USE forum_tani_id`,
    `CREATE TABLE users (
        username VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
        name varchar(100) NOT NULL,
        pekerjaan varchar(100) not null,
        total_post int,
        total_jawaban int,
        foto_profil varchar(255),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nomor_telepon VARCHAR(15),
        role
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE posts (
        id int PRIMARY KEY AUTO_INCREMENT,
        uploaderId VARCHAR(255) NOT NULL,            
        caption TEXT,                                
        gambar BLOB,
        likes int DEFAULT 0,                                  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP                         
    )`,
    `CREATE TABLE product_tag (
        id int PRIMARY KEY AUTO_INCREMENT,
        tag VARCHAR(100) not NULL,
        uploader_id VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE comments (
        id INT AUTO_INCREMENT PRIMARY KEY,             -- ID unik untuk setiap komentar
        post_id INT NOT NULL,                          -- ID postingan yang dikomentari
        user_id varchar(50),                          -- ID pengguna yang mengomentari
        parent_comment_id INT DEFAULT NULL,            -- ID komentar induk (untuk balasan)
        content TEXT NOT NULL,                         -- Isi komentar
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan komentar
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Waktu pembaruan
        FOREIGN KEY (post_id) REFERENCES posts(id),    -- Relasi ke tabel posts
        FOREIGN KEY (user_id) REFERENCES users(username),    -- Relasi ke tabel users
        FOREIGN KEY (parent_comment_id) REFERENCES comments(id) -- Relasi untuk nested comments
    );`,
    `CREATE TABLE products(
        id int auto_increment primary key,
        nama varchar(255) NOT NULL,
        picture varchar(255) NOT NULL,
        description varchar(1000) not NULL,
        harga int not null,
        lokasi varchar(100) not null,
        whatsapp_number varchar(15) not null,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uploader_id VARCHAR(50),
        foreign key (uploader_id) references users(username)
    );`
];

(async () => {
  const connection = await mysql.createConnection(config);

  try {
    console.log("Migration dimulai!");

    for (const e of queries) {
      await connection.query(e);
      console.log(`Query berhasil dieksekusi: ${e}\n`);
    }

    console.log("Migrasi berhasil!");
  } catch (error) {
    console.error("Terjadi kesalahan saat migrasi:", error);
  } finally {
    await connection.end();
  }
})();
