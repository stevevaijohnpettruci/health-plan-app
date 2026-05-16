import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

class UserRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async CreateUser({ fullname, email, password }) {
    const id = `users-${+new Date()}-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO users(
          id,
          fullname,
          email,
          password,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
      values: [id, fullname, email, hashedPassword, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async VerifyEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this.pool.query(query);
    return result.rowCount > 0;
  }

  async VerifyUserById(id) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async GetUserById(id) {
    const query = {
      text: `
        SELECT
          id,
          fullname,
          email,
          created_at,
          updated_at
        FROM users
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    const { id, password: hashedPassword } = result.rows[0];

    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      return null;
    }

    return id;
  }

  async editUsernameByUserId(user_id, fullname) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        UPDATE users
        SET
          fullname = $1,
          updated_at = $2
        WHERE id = $3
        RETURNING id, fullname, email
      `,
      values: [fullname, updatedAt, user_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editPasswordByUserId(user_id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        UPDATE users
        SET
          password = $1,
          updated_at = $2
        WHERE id = $3
        RETURNING id
      `,
      values: [hashedPassword, updatedAt, user_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new UserRepositories();
