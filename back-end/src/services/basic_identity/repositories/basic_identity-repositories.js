import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class BasicIdentityRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addUserBasicIdentity({
    user_id,
    age,
    gender,
    weight,
    height,
    activity_level,
  }) {
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO basic_identity(
          id,
          user_id,
          age,
          gender,
          weight,
          height,
          activity_level,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `,
      values: [
        id,
        user_id,
        age,
        gender,
        weight,
        height,
        activity_level,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getUserBasicIdentityByUserId(user_id) {
    const query = {
      text: 'SELECT * FROM basic_identity WHERE user_id = $1',
      values: [user_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editUserBasicIdentityByUserId(
    user_id,
    { age, gender, weight, height, activity_level },
  ) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
          UPDATE basic_identity
          SET
            age = $1,
            gender = $2,
            weight = $3,
            height = $4,
            activity_level = $5,
            updated_at = $6
          WHERE user_id = $7
          RETURNING *
        `,
      values: [age, gender, weight, height, activity_level, updatedAt, user_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default BasicIdentityRepositories;
