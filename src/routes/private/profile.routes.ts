import { Router } from 'express';
import {
	getProfile,
	getProfileSchedules,
	signProfileSchedule,
	updateProfile,
} from '../../controllers/profile.controller';
import authorize from '../../middleware/authentication.middleware';
import {
	SignProfileScheduleValidation,
	UpdateProfileValidation,
} from '../../middleware/validation/profile.validation';

const router = Router();

router.route('/').get(authorize([]), getProfile);
router.route('/schedule').get(authorize([]), getProfileSchedules);
router.route('/').patch(authorize([]), UpdateProfileValidation, updateProfile);
router
	.route('/sign/:date')
	.patch(authorize([]), SignProfileScheduleValidation, signProfileSchedule);

export default router;
