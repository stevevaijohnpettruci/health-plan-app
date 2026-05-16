import {
  addGoalSetting,
  getGoalSettingByUserId,
  editGoalSettingByUserId,
} from '../controller/goals_setting-controller.js';
import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  createGoalSettingSchema,
  updateGoalSettingSchema,
} from '../validator/schema.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  validate(createGoalSettingSchema),
  addGoalSetting,
);
router.get('/:user_id', authenticateToken, getGoalSettingByUserId);
router.put(
  '/:user_id',
  authenticateToken,
  validate(updateGoalSettingSchema),
  editGoalSettingByUserId,
);

export default router;
