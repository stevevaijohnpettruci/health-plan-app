import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class GoalSettingRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addGoalSetting({
    userId,
    primaryGoal,
    targetWeightKg,
    commitmentDays,
    preferredActivity,
  }) {
    const id = `goal-${nanoid(16)}`;
    const createdAt = new Date();
    const updatedAt = createdAt;

    const query = {
      text: `
        INSERT INTO goals_setting (
          id,
          user_id,
          primary_goal,
          target_weight_kg,
          commitment_days,
          preferred_activity,
          created_at,
          updated_at
        )
        VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8
        )
        RETURNING id
      `,
      values: [
        id,
        userId,
        primaryGoal,
        targetWeightKg,
        commitmentDays,
        preferredActivity,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);

    return result.rows[0].id;
  }

  async getGoalSettingByUserId(userId) {
    const query = {
      text: `
        SELECT
          id,
          user_id,
          primary_goal,
          target_weight_kg,
          commitment_days,
          preferred_activity,
          created_at,
          updated_at
        FROM goals_setting
        WHERE user_id = $1
      `,
      values: [userId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getGoalSettingById(id) {
    const query = {
      text: `
        SELECT
          id,
          user_id,
          primary_goal,
          target_weight_kg,
          commitment_days,
          preferred_activity,
          created_at,
          updated_at
        FROM goals_setting
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async updateGoalSettingById(
    id,
    { primaryGoal, targetWeightKg, commitmentDays, preferredActivity },
  ) {
    const updatedAt = new Date();

    const query = {
      text: `
        UPDATE goals_setting
        SET
          primary_goal = $1,
          target_weight_kg = $2,
          commitment_days = $3,
          preferred_activity = $4,
          updated_at = $5
        WHERE id = $6
        RETURNING id
      `,
      values: [
        primaryGoal,
        targetWeightKg,
        commitmentDays,
        preferredActivity,
        updatedAt,
        id,
      ],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }
}

export default GoalSettingRepositories;
