import { Router } from 'express';
import {
	changeProfilePassword,
	getProfile,
	getProfileAcupunctureReports,
	getProfilePayrolls,
	getProfileSchedules,
	logout,
	signProfileSchedule,
	updateProfile,
} from '../../controllers/profile.controller';
import authorize from '../../middleware/authentication.middleware';
import {
	ChangeProfilePasswordValidation,
	GetProfileAcupunctureReportsValidation,
	GetProfilePayrollsValidation,
	GetProfileSchedulesValidation,
	LogoutValidation,
	SignProfileScheduleValidation,
	UpdateProfileValidation,
} from '../../middleware/validation/profile.validation';

const router = Router();

router.use(authorize([]));

router.route('/').get(getProfile);
router
	.route('/schedule')
	.get(GetProfileSchedulesValidation, getProfileSchedules);
router.route('/payroll').get(GetProfilePayrollsValidation, getProfilePayrolls);
router
	.route('/acupuncture-report')
	.get(GetProfileAcupunctureReportsValidation, getProfileAcupunctureReports);
router.route('/').patch(UpdateProfileValidation, updateProfile);
router
	.route('/change_password')
	.patch(ChangeProfilePasswordValidation, changeProfilePassword);
router
	.route('/sign/:date')
	.patch(SignProfileScheduleValidation, signProfileSchedule);
router.route('/logout').post(LogoutValidation, logout);

export default router;
