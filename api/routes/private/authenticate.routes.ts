import { Router } from 'express';
import authorize from '../../middleware/authentication.middleware';
import { authenticate } from '../../controllers/authenticate.controller';

const router = Router();

router.route('/').post(authorize([]), authenticate);

export default router;
