import BasicIdentityRepositories from '../repositories/basic_identity-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';

export const addUserBasicIdentity = async (req, res, next) => {
  const { user_id, age, gender, weight, height, activity_level } =
    req.validated;

  const isUserExist =
    await BasicIdentityRepositories.getUserBasicIdentityByUserId(user_id);

  if (isUserExist) {
    return next(
      new InvariantError(
        'Gagal menambahkan basic identity. User sudah memiliki basic identity.',
      ),
    );
  }

  const userBasicIdentity =
    await BasicIdentityRepositories.addUserBasicIdentity({
      user_id,
      age,
      gender,
      weight,
      height,
      activity_level,
    });

  if (!userBasicIdentity) {
    return next(new InvariantError('Gagal menambahkan basic identity.'));
  }

  return response(res, 201, 'Basic identity berhasil ditambahkan', {
    id: userBasicIdentity.id,
  });
};

export const getUserBasicIdentityByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  const userBasicIdentity =
    await BasicIdentityRepositories.getUserBasicIdentityByUserId(user_id);

  if (!userBasicIdentity) {
    return next(new NotFoundError('Basic identity tidak ditemukan.'));
  }

  return response(res, 200, 'Basic identity berhasil ditampilkan', {
    userBasicIdentity,
  });
};

export const editUserBasicIdentityByUserId = async (req, res, next) => {
  const { age, gender, weight, height, activity_level } = req.validated;
  const { user_id } = req.params;

  const isUserBasicIdentityExist =
    await BasicIdentityRepositories.getUserBasicIdentityByUserId(user_id);

  if (!isUserBasicIdentityExist) {
    return next(new NotFoundError('Basic identity tidak ditemukan.'));
  }

  const userBasicIdentity =
    await BasicIdentityRepositories.editUserBasicIdentityByUserId(user_id, {
      age,
      gender,
      weight,
      height,
      activity_level,
    });

  if (!userBasicIdentity) {
    return next(new InvariantError('Gagal mengubah basic identity.'));
  }

  return response(res, 200, 'Basic identity berhasil diubah', {
    userBasicIdentity,
  });
};
