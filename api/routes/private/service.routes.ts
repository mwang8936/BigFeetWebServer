import { Router } from 'express';
import {
	getServices,
	getService,
	updateService,
	addService,
	deleteService,
	recoverService,
} from '../../controllers/service.controller';
import { Permissions } from '../../models/enums';
import {
	GetServicesValidation,
	GetServiceValidation,
	UpdateServiceValidation,
	AddServiceValidation,
	DeleteServiceValidation,
	RecoverServiceValidation,
} from '../../middleware/validation/service.validation';
import authorize from '../../middleware/authentication.middleware';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_SERVICE]),
		GetServicesValidation,
		getServices
	);
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
router
	.route('/:service_id/recover')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_SERVICE]),
		RecoverServiceValidation,
		recoverService
	);

export default router;
