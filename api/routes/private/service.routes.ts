import { Router } from 'express';
import {
	getServices,
	getService,
	updateService,
	addService,
	deleteService,
} from '../../controllers/service.controller';
import { Permissions } from '../../models/enums';
import {
	GetServiceValidation,
	UpdateServiceValidation,
	AddServiceValidation,
	DeleteServiceValidation,
} from '../../middleware/validation/service.validation';
import authorize from '../../middleware/authentication.middleware';

const router = Router();

router
	.route('/')
	.get(authorize([Permissions.PERMISSION_GET_SERVICE]), getServices);
router
	.route('/:service_id')
	.get(
		authorize([Permissions.PERMISSION_GET_SERVICE]),
		GetServiceValidation,
		getService
	);
router
	.route('/:service_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_SERVICE]),
		UpdateServiceValidation,
		updateService
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_SERVICE]),
		AddServiceValidation,
		addService
	);
router
	.route('/:service_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_SERVICE]),
		DeleteServiceValidation,
		deleteService
	);

export default router;
