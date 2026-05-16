import { Router } from 'express';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';

const router = Router();

router.use('/api/v1', users);
router.use('/api/v1', authentications);

export default router;
