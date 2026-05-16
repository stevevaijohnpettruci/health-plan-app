import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import {
  addLifestyleAssessment,
  getLifestyleAssessmentByUserId,
  editLifestyleAssessmentByUserId,
} from '../controller/lifestyle_assessment-controller.js';
import validate from '../../../middlewares/validate.js';
import {
  createLifestyleAssessmentSchema,
  updateLifestyleAssessmentSchema,
} from '../validator/schema.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  validate(createLifestyleAssessmentSchema),
  addLifestyleAssessment,
);
router.get('/:user_id', authenticateToken, getLifestyleAssessmentByUserId);
router.put(
  '/:user_id',
  authenticateToken,
  validate(updateLifestyleAssessmentSchema),
  editLifestyleAssessmentByUserId,
);

export default router;
