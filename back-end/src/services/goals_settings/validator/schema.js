import Joi from 'joi';

export const createGoalSettingSchema = Joi.object({
  user_id: Joi.string().required(),

  primary_goal: Joi.string()
    .valid('Weight Loss', 'Muscle Gain', 'Endurance', 'General Well-being')
    .required(),

  target_weight_kg: Joi.number().positive().required(),

  commitment_days: Joi.number().integer().min(1).max(7).required(),

  preferred_activity: Joi.array()
    .items(Joi.string().valid('Yoga', 'Lari', 'Angkat Beban', 'Jalan Kaki'))
    .min(1)
    .required(),
}).options({ abortEarly: false });

export const updateGoalSettingSchema = Joi.object({
  primary_goal: Joi.string()
    .valid('Weight Loss', 'Muscle Gain', 'Endurance', 'General Well-being')
    .optional(),

  target_weight_kg: Joi.number().positive().optional(),

  commitment_days: Joi.number().integer().min(1).max(7).optional(),

  preferred_activity: Joi.array()
    .items(Joi.string().valid('Yoga', 'Lari', 'Angkat Beban', 'Jalan Kaki'))
    .min(1)
    .optional(),
}).options({ abortEarly: false });
