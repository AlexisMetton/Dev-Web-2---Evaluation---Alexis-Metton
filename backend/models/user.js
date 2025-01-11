const pool = require("../config/db");

const User = {
  create: async (user) => {
    const roles = user.roles
      ? JSON.stringify(user.roles)
      : JSON.stringify(["ROLE_USER"]);
    const query =
      "INSERT INTO users (username, password, email, roles) VALUES (?, ?, ?, ?)";
    const params = [user.username, user.password, user.email, roles];
    const [result] = await pool.execute(query, params);
    return { id: result.insertId, ...user, roles: JSON.parse(roles) };
  },

  getAll: async () => {
    const query = "SELECT * FROM users";
    try {
      const [results] = await pool.execute(query);
      return results;
    } catch (err) {
      throw new Error("Error fetching all users: " + err.message);
    }
  },

  findByUsername: async (username) => {
    const query = "SELECT * FROM users WHERE username = ?";
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
  },

  findByUsernameOrEmail: async (username, email) => {
    const query = "SELECT * FROM users WHERE username = ? OR email = ?";
    const [rows] = await pool.execute(query, [username, email]);
    return rows[0];
  },

  findById: async (id) => {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await pool.execute(query, [id]);
    if (rows.length) {
      rows[0].roles = JSON.parse(rows[0].roles);
      return rows[0];
    }
    return null;
  },

  delete: async (id) => {
    const queryTasks = "DELETE FROM tasks WHERE user_id = ?";
    await pool.execute(queryTasks, [id]);

    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }
    return id;
  },

  update: async (id, updatedFields) => {
    const query = `
            UPDATE users 
            SET 
                username = COALESCE(?, username),
                email = COALESCE(?, email),
                password = COALESCE(?, password),
                roles = COALESCE(?, roles)
            WHERE id = ?`;

    const params = [
      updatedFields.username || null,
      updatedFields.email || null,
      updatedFields.password || null,
      updatedFields.roles ? JSON.parse(updatedFields.roles) : null,
      id,
    ];

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }

    return { id, ...updatedFields };
  },
  getUsersByRole: async (role) => {
    const query = `
            SELECT * 
            FROM users 
            WHERE JSON_CONTAINS(roles, ?) 
            AND NOT JSON_CONTAINS(roles, '["ROLE_ADMIN"]') 
            AND NOT JSON_CONTAINS(roles, '["ROLE_SUPERADMIN"]')
        `;
    const params = [`"${role}"`];
    try {
      const [results] = await pool.execute(query, params);
      return results.map((user) => {
        user.roles = JSON.parse(user.roles);
        return user;
      });
    } catch (err) {
      throw new Error("Error fetching users by role: " + err.message);
    }
  },
};

module.exports = User;
