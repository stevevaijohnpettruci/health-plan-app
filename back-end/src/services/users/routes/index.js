import {
  addNewUser,
  getUserById,
  addUserBasicIdentity,
} from '../controller/user-controller.js';
import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import {
  UserPayloadSchema,
  UserBasicIdentitySchema,
} from '../validator/schema.js';
import authenticateToken from '../.././../middleware/auth.js';

const router = Router();

router.post('/users', validate(UserPayloadSchema), addNewUser);
router.get('/users/:id', getUserById);
router.post(
  '/users/basic_identity',
  authenticateToken,
  validate(UserBasicIdentitySchema),
  addUserBasicIdentity,
);

export default router;
