const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findById(id) {
    const { rows } = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return rows[0];
  }

  static async create({ name, email, password, role = 'customer' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role]
    );
    return rows[0];
  }

  static async update(id, updates) {
    const allowedUpdates = ['name', 'email', 'password'];
    const updateFields = [];
    const values = [];
    let valueCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateFields.push(`${key} = $${valueCount}`);
        values.push(updates[key]);
        valueCount++;
      }
    });

    if (updateFields.length === 0) return null;

    values.push(id);
    const { rows } = await db.query(
      `UPDATE users 
       SET ${updateFields.join(', ')}, updated_at = NOW()
       WHERE id = $${valueCount}
       RETURNING id, name, email, role`,
      values
    );
    return rows[0];
  }
}

module.exports = User; 