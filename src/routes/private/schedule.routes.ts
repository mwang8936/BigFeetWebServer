import { Router } from 'express';
import { Permissions } from '../../models/enums';
import authorize from '../../middleware/authentication.middleware';
import {
	addSchedule,
	deleteSchedule,
	getSchedule,
	getSchedules,
	signSchedule,
	updateSchedule,
} from '../../controllers/schedule.controller';
import {
	AddScheduleValidation,
	DeleteScheduleValidation,
	GetScheduleValidation,
	GetSchedulesValidation,
	SignScheduleValidation,
	UpdateScheduleValidation,
} from '../../middleware/validation/schedule.validation';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_SCHEDULE]),
		GetSchedulesValidation,
		getSchedules
	);
router
	.route('/:date/employee/:employee_id')
	.get(
		authorize([Permissions.PERMISSION_GET_SCHEDULE]),
		GetScheduleValidation,
		getSchedule
	);
router
	.route('/:date/employee/:employee_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_SCHEDULE]),
		UpdateScheduleValidation,
		updateSchedule
	);
router
	.route('/:date/employee/:employee_id/sign')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_SCHEDULE]),
		SignScheduleValidation,
		signSchedule
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_SCHEDULE]),
		AddScheduleValidation,
		addSchedule
	);
router
	.route('/:date/employee/:employee_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_SCHEDULE]),
		DeleteScheduleValidation,
		deleteSchedule
	);

export default router;
