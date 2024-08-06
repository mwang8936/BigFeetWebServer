import { Router } from 'express';
import {
	getEmployees,
	getEmployee,
	updateEmployee,
	addEmployee,
	deleteEmployee,
	recoverEmployee,
} from '../../controllers/employee.controller';
import { Permissions } from '../../models/enums';
import {
	GetEmployeesValidation,
	GetEmployeeValidation,
	UpdateEmployeeValidation,
	AddEmployeeValidation,
	DeleteEmployeeValidation,
	RecoverEmployeeValidation,
} from '../../middleware/validation/employee.validation';
import authorize from '../../middleware/authentication.middleware';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_EMPLOYEE]),
		GetEmployeesValidation,
		getEmployees
	);
router
	.route('/:employee_id')
	.get(
		authorize([Permissions.PERMISSION_GET_EMPLOYEE]),
		GetEmployeeValidation,
		getEmployee
	);
router
	.route('/:employee_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_EMPLOYEE]),
		UpdateEmployeeValidation,
		updateEmployee
	);
router.route('/').post(
	// authorize([Permissions.PERMISSION_ADD_EMPLOYEE]),
	AddEmployeeValidation,
	addEmployee
);
router
	.route('/:employee_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_EMPLOYEE]),
		DeleteEmployeeValidation,
		deleteEmployee
	);
router
	.route('/:employee_id/recover')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_EMPLOYEE]),
		RecoverEmployeeValidation,
		recoverEmployee
	);

export default router;
