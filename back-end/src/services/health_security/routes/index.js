import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import {
  addHealthSecurity,
  getHealthSecurityByUserId,
  editHealthSecurityByUserId,
} from '../controller/health_security-controller.js';
import validate from '../../../middlewares/validate.js';
import {
  addHealthSecuritySchema,
  updateHealthSecuritySchema,
} from '../validator/schema.js';

const router = Router();

router.post(
  '/:user_id',
  authenticateToken,
  validate(addHealthSecuritySchema),
  addHealthSecurity,
);
router.get('/:user_id', authenticateToken, getHealthSecurityByUserId);
router.put(
  '/:user_id',
  authenticateToken,
  validate(updateHealthSecuritySchema),
  editHealthSecurityByUserId,
);

export default router;
