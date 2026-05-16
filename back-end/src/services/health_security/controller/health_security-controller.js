import HealthSecurityRepositories from '../repositories/health_security-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';

export const addHealthSecurity = async (req, res, next) => {
  const {
    user_id,
    medical_history,
    physical_injuries,
    current_medication,
    blood_pressure,
    heart_rate,
    allergy,
  } = req.validated;

  const isUserExist =
    await HealthSecurityRepositories.getHealthSecurityByUserId(user_id);

  if (isUserExist) {
    return next(
      new InvariantError(
        'Gagal menambahkan health security. User sudah memiliki health security.',
      ),
    );
  }

  const healthSecurity = await HealthSecurityRepositories.addHealthSecurity({
    user_id,
    medical_history,
    physical_injuries,
    current_medication,
    blood_pressure,
    heart_rate,
    allergy,
  });

  if (!healthSecurity) {
    return next(new InvariantError('Gagal menambahkan health security.'));
  }

  return response(res, 201, 'Health security berhasil ditambahkan', {
    id: healthSecurity.id,
  });
};

export const getHealthSecurityByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  const healthSecurity =
    await HealthSecurityRepositories.getHealthSecurityByUserId(user_id);

  if (!healthSecurity) {
    return next(new NotFoundError('Health security tidak ditemukan.'));
  }

  return response(res, 200, 'Health security berhasil ditampilkan', {
    healthSecurity,
  });
};

export const editHealthSecurityByUserId = async (req, res, next) => {
  const {
    medical_history,
    physical_injuries,
    current_medication,
    blood_pressure,
    heart_rate,
    allergy,
  } = req.validated;
  const { user_id } = req.params;

  const isHealthSecurityExist =
    await HealthSecurityRepositories.getHealthSecurityByUserId(user_id);

  if (!isHealthSecurityExist) {
    return next(new NotFoundError('Health security tidak ditemukan.'));
  }

  const healthSecurity =
    await HealthSecurityRepositories.editHealthSecurityByUserId(user_id, {
      medical_history,
      physical_injuries,
      current_medication,
      blood_pressure,
      heart_rate,
      allergy,
    });

  if (!healthSecurity) {
    return next(new InvariantError('Gagal mengubah health security.'));
  }

  return response(res, 200, 'Health security berhasil diubah', {
    healthSecurity,
  });
};
