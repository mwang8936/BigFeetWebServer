import { Router } from 'express';
import {
	getProfile,
	getProfileSchedules,
	updateProfile,
} from '../../controllers/profile.controller';
import authorize from '../../middleware/authentication.middleware';
import { UpdateProfileValidation } from '../../middleware/validation/profile.validation';

const router = Router();

router.route('/').get(authorize([]), getProfile);
router.route('/schedule').get(authorize([]), getProfileSchedules);
router.route('/').patch(authorize([]), UpdateProfileValidation, updateProfile);

export default router;
