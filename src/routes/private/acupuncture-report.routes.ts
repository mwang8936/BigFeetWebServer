import { Router } from 'express';
import authorize from '../../middleware/authentication.middleware';
import { Permissions } from '../../models/enums';
import {
	AddAcupunctureReportValidation,
	DeleteAcupunctureReportValidation,
	GetAcupunctureReportsValidation,
	GetAcupunctureReportValidation,
	UpdateAcupunctureReportValidation,
} from '../../middleware/validation/acupuncture-report.validation';
import {
	addAcupunctureReport,
	deleteAcupunctureReport,
	getAcupunctureReport,
	getAcupunctureReports,
	updateAcupunctureReport,
} from '../../controllers/acupuncture-report.controller';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_PAYROLL]),
		GetAcupunctureReportsValidation,
		getAcupunctureReports
	);
router
	.route('/:year/:month/employee/:employee_id')
	.get(
		authorize([Permissions.PERMISSION_GET_PAYROLL]),
		GetAcupunctureReportValidation,
		getAcupunctureReport
	);
router
	.route('/:year/:month/employee/:employee_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_PAYROLL]),
		UpdateAcupunctureReportValidation,
		updateAcupunctureReport
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_PAYROLL]),
		AddAcupunctureReportValidation,
		addAcupunctureReport
	);
router
	.route('/:year/:month/employee/:employee_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_PAYROLL]),
		DeleteAcupunctureReportValidation,
		deleteAcupunctureReport
	);

export default router;
