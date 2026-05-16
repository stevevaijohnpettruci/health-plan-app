import GoalSettingRepositories from '../repositories/goals_setting-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';

export const addGoalSetting = async (req, res, next) => {
  const {
    user_id,
    primary_goal,
    target_weight_kg,
    commitment_days,
    preferred_activity,
  } = req.validated;

  const isUserExist =
    await GoalSettingRepositories.getGoalSettingByUserId(user_id);

  if (isUserExist) {
    return next(
      new InvariantError(
        'Gagal menambahkan goal setting. User sudah memiliki goal setting.',
      ),
    );
  }

  const goalSetting = await GoalSettingRepositories.addGoalSetting({
    user_id,
    primary_goal,
    target_weight_kg,
    commitment_days,
    preferred_activity,
  });

  if (!goalSetting) {
    return next(new InvariantError('Gagal menambahkan goal setting.'));
  }

  return response(res, 201, 'Goal setting berhasil ditambahkan', {
    id: goalSetting,
  });
};

export const getGoalSettingByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  const goalSetting =
    await GoalSettingRepositories.getGoalSettingByUserId(user_id);

  if (!goalSetting) {
    return next(new NotFoundError('Goal setting tidak ditemukan.'));
  }

  return response(res, 200, 'Goal setting berhasil ditampilkan', {
    goalSetting,
  });
};

export const editGoalSettingByUserId = async (req, res, next) => {
  const { user_id } = req.params;
  const {
    primary_goal,
    target_weight_kg,
    commitment_days,
    preferred_activity,
  } = req.validated;

  const goalSetting =
    await GoalSettingRepositories.getGoalSettingByUserId(user_id);

  if (!goalSetting) {
    return next(new NotFoundError('Goal setting tidak ditemukan.'));
  }

  const updatedGoalSetting =
    await GoalSettingRepositories.updateGoalSettingByUserId(user_id, {
      primary_goal,
      target_weight_kg,
      commitment_days,
      preferred_activity,
    });

  if (!updatedGoalSetting) {
    return next(new InvariantError('Gagal memperbarui goal setting.'));
  }

  return response(res, 200, 'Goal setting berhasil diperbarui', {
    id: updatedGoalSetting,
  });
};
