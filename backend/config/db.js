require('dotenv').config();

const mysql = require('mysql2/promise');

const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const initializeDatabase = async () => {
    try {
        const database = process.env.DATABASE || "task_manager_demo";

        const connection = await pool.getConnection();

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);

        // Switch to the database
        await connection.query(`USE ${database}`);

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                roles TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create tasks table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT 0,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        const user = process.env.CREATE_USER || "user"
        const email = process.env.CREATE_EMAIL || "demoUser@demo.com"
        const password = process.env.CREATE_PASSWORD || "DemoPasswword8@"
        const role = process.env.CREATE_ROLE || ['ROLE_USER']
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.query(
            `
            INSERT IGNORE INTO users (username, password, email, roles) 
            VALUES (?, ?, ?, ?);
            `,
            [user, hashedPassword, email, JSON.stringify(role)]
        );

        console.log('Database and tables ensured to exist.');
        connection.release();
    } catch (err) {
        console.error('Error initializing the database:', err.message);
    }
};

initializeDatabase();

module.exports = pool;
