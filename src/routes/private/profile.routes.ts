import { Router } from 'express';
import {
	changeProfilePassword,
	getProfile,
	getProfileAcupunctureReports,
	getProfilePayrolls,
	getProfileSchedules,
	signProfileSchedule,
	updateProfile,
} from '../../controllers/profile.controller';
import authorize from '../../middleware/authentication.middleware';
import {
	ChangeProfilePasswordValidation,
	GetProfileAcupunctureReportsValidation,
	GetProfilePayrollsValidation,
	GetProfileSchedulesValidation,
	SignProfileScheduleValidation,
	UpdateProfileValidation,
} from '../../middleware/validation/profile.validation';

const router = Router();

router.route('/').get(authorize([]), getProfile);
router
	.route('/schedule')
	.get(authorize([]), GetProfileSchedulesValidation, getProfileSchedules);
router
	.route('/payroll')
	.get(authorize([]), GetProfilePayrollsValidation, getProfilePayrolls);
router
	.route('/acupuncture-report')
	.get(
		authorize([]),
		GetProfileAcupunctureReportsValidation,
		getProfileAcupunctureReports
	);
router.route('/').patch(authorize([]), UpdateProfileValidation, updateProfile);
router
	.route('/change_password')
	.patch(authorize([]), ChangeProfilePasswordValidation, changeProfilePassword);
router
	.route('/sign/:date')
	.patch(authorize([]), SignProfileScheduleValidation, signProfileSchedule);

export default router;
