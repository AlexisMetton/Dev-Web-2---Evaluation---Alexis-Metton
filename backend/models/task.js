const pool = require('../config/db');

const Task = {
    getAllByUser: async (userId) => {
        const query = 'SELECT * FROM tasks WHERE user_id = ?';
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    },

    getTaskId: async (taskId) => {
        const query = 'SELECT * FROM tasks WHERE id = ?';
        const [rows] = await pool.execute(query, [taskId]);
        
        if(!rows){
            return {error: "Task not found"}
        }
        return {task: rows[0]};
    },

    create: async (task) => {
        const query = 'INSERT INTO tasks (title, description, completed, user_id) VALUES (?, ?, ?, ?)';
        const params = [task.title, task.description, task.completed, task.user_id];
        const [result] = await pool.execute(query, params);
        return { id: result.insertId, ...task };
    },

    update: async (id, updates) => {
        const query = `
            UPDATE tasks
            SET title = ?, description = ?, completed = ?
            WHERE id = ?
        `;
        const params = [updates.title, updates.description, updates.completed, id];
        const [result] = await pool.execute(query, params);
        if (result.affectedRows === 0) {
            throw new Error('Task not found');
        }
        return { id, ...updates };
    },

    delete: async (id) => {
        const query = 'DELETE FROM tasks WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        if (result.affectedRows === 0) {
            throw new Error('Task not found');
        }
        return id;
    },
};

module.exports = Task;
