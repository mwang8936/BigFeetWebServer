import { Router } from 'express';
import authorize from '../../middleware/authentication.middleware';
import { Permissions } from '../../models/enums';
import {
	AddPayrollValidation,
	DeletePayrollValidation,
	GetPayrollsValidation,
	GetPayrollValidation,
	RefreshPayrollValidation,
	UpdatePayrollValidation,
} from '../../middleware/validation/payroll.validation';
import {
	addPayroll,
	deletePayroll,
	getPayroll,
	getPayrolls,
	refreshPayroll,
	updatePayroll,
} from '../../controllers/payroll.controller';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_PAYROLL]),
		GetPayrollsValidation,
		getPayrolls
	);
router
	.route('/:year/:month/:part/employee/:employee_id')
	.get(
		authorize([Permissions.PERMISSION_GET_PAYROLL]),
		GetPayrollValidation,
		getPayroll
	);
router
	.route('/:year/:month/:part/employee/:employee_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_PAYROLL]),
		UpdatePayrollValidation,
		updatePayroll
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_PAYROLL]),
		AddPayrollValidation,
		addPayroll
	);
router
	.route('/:year/:month/:part/employee/:employee_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_PAYROLL]),
		DeletePayrollValidation,
		deletePayroll
	);
router
	.route('/refresh/:year/:month/:part/employee/:employee_id')
	.patch(authorize([]), RefreshPayrollValidation, refreshPayroll);

export default router;
