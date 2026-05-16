import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class LifestyleAssessmentRepositories {
  constructor() {
    this.pool = new Pool();
  }
  
  async addLifeStyleAssesment({
    dietary_pattern,
    meals_per_day,
    daily_water_intake_goal,
    avg_sleep_hours,
    smoking_habits,
    user_id,
  }) {
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO lifestyle_assessment(
          id,
          user_id,
          dietary_pattern,
          meals_per_day,
          daily_water_intake_goal,
          avg_sleep_hours,
          smoking_habits,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `,
      values: [
        id,
        user_id,
        dietary_pattern,
        meals_per_day,
        daily_water_intake_goal,
        avg_sleep_hours,
        smoking_habits,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getLifeStyleAssesmentByUserId(user_id) {
    const query = {
      text: 'SELECT * FROM lifestyle_assessment WHERE user_id = $1',
      values: [user_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editLifeStyleAssesmentByUserId(
    user_id,
    {
      dietary_pattern,
      meals_per_day,
      daily_water_intake_goal,
      avg_sleep_hours,
      smoking_habits,
    },
  ) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        UPDATE lifestyle_assessment
        SET
          dietary_pattern = $1,
          meals_per_day = $2,
          daily_water_intake_goal = $3,
          avg_sleep_hours = $4,
          smoking_habits = $5,
          updated_at = $6
        WHERE user_id = $7
        RETURNING *
      `,
      values: [
        dietary_pattern,
        meals_per_day,
        daily_water_intake_goal,
        avg_sleep_hours,
        smoking_habits,
        updatedAt,
        user_id,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default LifestyleAssessmentRepositories;
