import LifestyleAssessmentRepositories from '../repositories/lifestyle_assessment-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';

export const addLifestyleAssessment = async (req, res, next) => {
  const {
    user_id,
    dietary_pattern,
    meals_per_day,
    daily_water_intake_goal,
    avg_sleep_hours,
    smoking_habits,
  } = req.validated;

  const isUserExist =
    await LifestyleAssessmentRepositories.getLifeStyleAssesmentByUserId(
      user_id,
    );

  if (isUserExist) {
    return next(
      new InvariantError(
        'Gagal menambahkan lifestyle assessment. User sudah memiliki lifestyle assessment.',
      ),
    );
  }

  const lifestyleAssessment =
    await LifestyleAssessmentRepositories.addLifeStyleAssesment({
      user_id,
      dietary_pattern,
      meals_per_day,
      daily_water_intake_goal,
      avg_sleep_hours,
      smoking_habits,
    });

  if (!lifestyleAssessment) {
    return next(new InvariantError('Gagal menambahkan lifestyle assessment.'));
  }

  return response(res, 201, 'Lifestyle assessment berhasil ditambahkan', {
    id: lifestyleAssessment.id,
  });
};

export const getLifestyleAssessmentByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  const lifestyleAssessment =
    await LifestyleAssessmentRepositories.getLifeStyleAssesmentByUserId(
      user_id,
    );

  if (!lifestyleAssessment) {
    return next(new NotFoundError('Lifestyle assessment tidak ditemukan.'));
  }

  return response(res, 200, 'Lifestyle assessment berhasil ditampilkan', {
    lifestyleAssessment,
  });
};

export const editLifestyleAssessmentByUserId = async (req, res, next) => {
  const { user_id } = req.params;
  const {
    dietary_pattern,
    meals_per_day,
    daily_water_intake_goal,
    avg_sleep_hours,
    smoking_habits,
  } = req.validated;

  const lifestyleAssessment =
    await LifestyleAssessmentRepositories.updateLifeStyleAssesmentByUserId(
      user_id,
      {
        dietary_pattern,
        meals_per_day,
        daily_water_intake_goal,
        avg_sleep_hours,
        smoking_habits,
      },
    );

  if (!lifestyleAssessment) {
    return next(new InvariantError('Gagal memperbarui lifestyle assessment.'));
  }

  return response(res, 200, 'Lifestyle assessment berhasil diperbarui', {
    id: lifestyleAssessment.id,
  });
};
