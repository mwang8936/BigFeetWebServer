import { Router } from 'express';
import {
	changeProfilePassword,
	getProfile,
	getProfileSchedules,
	signProfileSchedule,
	updateProfile,
} from '../../controllers/profile.controller';
import authorize from '../../middleware/authentication.middleware';
import {
	ChangeProfilePasswordValidation,
	SignProfileScheduleValidation,
	UpdateProfileValidation,
} from '../../middleware/validation/profile.validation';

const router = Router();

router.route('/').get(authorize([]), getProfile);
router.route('/schedule').get(authorize([]), getProfileSchedules);
router.route('/').patch(authorize([]), UpdateProfileValidation, updateProfile);
router
	.route('/change_password')
	.patch(authorize([]), ChangeProfilePasswordValidation, changeProfilePassword);
router
	.route('/sign/:date')
	.patch(authorize([]), SignProfileScheduleValidation, signProfileSchedule);

export default router;
