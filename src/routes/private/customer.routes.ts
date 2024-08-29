import { Router } from 'express';

import {
	getCustomers,
	getCustomer,
	updateCustomer,
	addCustomer,
	deleteCustomer,
	recoverCustomer,
	getCustomerHistories,
} from '../../controllers/customer.controller';

import authorize from '../../middleware/authentication.middleware';

import {
	GetCustomersValidation,
	GetCustomerValidation,
	UpdateCustomerValidation,
	AddCustomerValidation,
	DeleteCustomerValidation,
	RecoverCustomerValidation,
	GetCustomerHistoriesValidation,
} from '../../middleware/validation/customer.validation';

import { Permissions } from '../../models/enums';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_CUSTOMER]),
		GetCustomersValidation,
		getCustomers
	);
router
	.route('/histories')
	.get(
		authorize([Permissions.PERMISSION_GET_CUSTOMER]),
		GetCustomerHistoriesValidation,
		getCustomerHistories
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
