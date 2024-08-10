import { Router } from 'express';
import authorize from '../../middleware/authentication.middleware';
import {
	authenticate,
	authenticatePusher,
} from '../../controllers/authenticate.controller';

const router = Router();

router.route('/').post(authorize([]), authenticate);
router.route('/pusher').post(authorize([]), authenticatePusher);

export default router;
