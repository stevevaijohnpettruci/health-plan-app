import {
  addUserBasicIdentity,
  editUserBasicIdentityByUserId,
  getUserBasicIdentityByUserId,
} from '../controller/basic_identity-controller.js';
import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  createBasicIdentitySchema,
  updateBasicIdentitySchema,
} from '../validator/schema.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  validate(createBasicIdentitySchema),
  addUserBasicIdentity,
);
router.get('/:user_id', authenticateToken, getUserBasicIdentityByUserId);
router.put(
  '/:user_id',
  authenticateToken,
  validate(updateBasicIdentitySchema),
  editUserBasicIdentityByUserId,
);

export default router;
