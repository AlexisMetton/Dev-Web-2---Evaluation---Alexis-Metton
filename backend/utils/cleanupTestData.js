require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    const pool = mysql.createPool({
        host: process.env.HOST || 'localhost',
        user: process.env.USER || 'root',
        password: process.env.PASSWORD || '',
        database: process.env.DATABASE || 'task_manager_demo',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    try {
        console.log("Cleaning up test data...");

        await pool.query(`
            DELETE FROM tasks 
            WHERE description LIKE 'test_e2e_%';
        `);

        await pool.query(`
            DELETE FROM tasks 
            WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
        `);

        await pool.query(`
            DELETE FROM users WHERE username LIKE 'test_%';
        `);

        console.log("Test data cleanup completed.");
    } catch (error) {
        console.error("Error during test data cleanup:", error.message);
    } finally {
        await pool.end();
    }
})();
