import Joi from 'joi';

export const UserPayloadSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
});

export const UserBasicIdentitySchema = Joi.object({
  user_id: Joi.string().required(),
  age: Joi.number().integer().positive().required(),
  gender: Joi.string().valid('male', 'female').required(),
  weight: Joi.number().positive().required(),
  height: Joi.number().positive().required(),
  activity_level: Joi.string()
    .valid(
      'Sendentary',
      'Light Active',
      'Moderately Active',
      'Very Active',
      'Extra Active',
    )
    .required(),
});
