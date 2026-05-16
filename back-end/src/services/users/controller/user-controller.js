import UserRepositories from '../repositories/user-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';

export const addNewUser = async (req, res, next) => {
  const { fullname, email, password } = req.validated;

  const isEmailExist = await UserRepositories.VerifyEmail(email);

  if (isEmailExist.length > 0) {
    return next(
      new InvariantError('Gagal menambahkan user. Email sudah digunakan.'),
    );
  }

  const user = await UserRepositories.CreateUser({
    fullname,
    email,
    password,
  });

  if (!user) {
    return next(new InvariantError('Gagal menambahkan user.'));
  }

  return response(res, 201, 'User berhasil ditambahkan', {
    id: user.id,
  });
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  const user = await UserRepositories.GetUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan.'));
  }

  return response(res, 200, 'User berhasil ditampilkan', { user });
};

export const addUserBasicIdentity = async (req, res, next) => {
  const { user_id, age, gender, weight, height, activity_level } =
    req.validated;

  const isUserExist = await UserRepositories.VerifyUserById(user_id);

  if (isUserExist.length === 0) {
    return next(new NotFoundError('User tidak ditemukan.'));
  }

  const userBasicIdentity = await UserRepositories.addUserBasicIdentity({
    user_id,
    age,
    gender,
    weight,
    height,
    activity_level,
  });

  if (!userBasicIdentity) {
    return next(new InvariantError('Gagal menambahkan data user.'));
  }

  return response(res, 201, 'Data user berhasil ditambahkan', {
    id: userBasicIdentity.id,
    userId: userBasicIdentity.user_id,
  });
};
