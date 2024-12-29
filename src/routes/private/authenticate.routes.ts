import { Router } from 'express';
import authorize from '../../middleware/authentication.middleware';
import {
	authenticate,
	authenticatePusher,
} from '../../controllers/authenticate.controller';
import { AuthenticatePusherValidation } from '../../middleware/validation/authentication.validation';

const router = Router();

router.route('/').post(authorize([]), authenticate);
router
	.route('/pusher')
	.post(authorize([]), AuthenticatePusherValidation, authenticatePusher);

export default router;
