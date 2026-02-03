import { Router } from 'express';
import { Permissions } from '../../models/enums';
import {
	getCustomers,
	getCustomer,
	searchCustomer,
	updateCustomer,
	addCustomer,
	deleteCustomer,
	recoverCustomer,
} from '../../controllers/customer.controller';
import {
	GetCustomersValidation,
	GetCustomerValidation,
	SearchCustomerValidation,
	UpdateCustomerValidation,
	AddCustomerValidation,
	DeleteCustomerValidation,
	RecoverCustomerValidation,
} from '../../middleware/validation/customer.validation';
import authorize from '../../middleware/authentication.middleware';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_CUSTOMER]),
		GetCustomersValidation,
		getCustomers
	);
router
	.route('/search')
	.get(
		authorize([Permissions.PERMISSION_GET_CUSTOMER]),
		SearchCustomerValidation,
		searchCustomer
	);
router
	.route('/:customer_id')
	.get(
		authorize([Permissions.PERMISSION_GET_CUSTOMER]),
		GetCustomerValidation,
		getCustomer
	);
router
	.route('/:customer_id')
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
	.route('/:customer_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_CUSTOMER]),
		DeleteCustomerValidation,
		deleteCustomer
	);
router
	.route('/:customer_id/recover')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_CUSTOMER]),
		RecoverCustomerValidation,
		recoverCustomer
	);

export default router;
