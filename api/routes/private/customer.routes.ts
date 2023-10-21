import { Router } from 'express';
import { Permissions } from '../../models/enums';
import {
	getCustomers,
	getCustomer,
	updateCustomer,
	addCustomer,
	deleteCustomer,
} from '../../controllers/customer.controller';
import {
	GetCustomerValidation,
	UpdateCustomerValidation,
	AddCustomerValidation,
	DeleteCustomerValidation,
} from '../../middleware/validation/customer.validation';
import authorize from '../../middleware/authentication.middleware';

const router = Router();

router
	.route('/')
	.get(authorize([Permissions.PERMISSION_GET_CUSTOMER]), getCustomers);
router
	.route('/:phone_number')
	.get(
		authorize([Permissions.PERMISSION_GET_CUSTOMER]),
		GetCustomerValidation,
		getCustomer
	);
router
	.route('/:phone_number')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_CUSTOMER]),
		UpdateCustomerValidation,
		updateCustomer
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_CUSTOMER]),
		AddCustomerValidation,
		addCustomer
	);
router
	.route('/:phone_number')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_CUSTOMER]),
		DeleteCustomerValidation,
		deleteCustomer
	);

export default router;
