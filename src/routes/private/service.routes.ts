import { Router } from 'express';

import {
	getServices,
	getService,
	updateService,
	addService,
	deleteService,
	recoverService,
	addServiceRecord,
	getServiceRecords,
	deleteServiceRecord,
	continueService,
	disContinueService,
} from '../../controllers/service.controller';

import authorize from '../../middleware/authentication.middleware';

import {
	GetServicesValidation,
	GetServiceValidation,
	UpdateServiceValidation,
	AddServiceValidation,
	DeleteServiceValidation,
	RecoverServiceValidation,
	AddServiceRecordValidation,
	GetServiceRecordsValidation,
	DeleteServiceRecordValidation,
	ContinueServiceValidation,
	DiscontinueServiceValidation,
} from '../../middleware/validation/service.validation';

import { Permissions } from '../../models/enums';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_SERVICE]),
		GetServicesValidation,
		getServices
	);
router
	.route('/records/:date')
	.get(
		authorize([Permissions.PERMISSION_GET_SERVICE]),
		GetServiceRecordsValidation,
		getServiceRecords
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
	.post(
		authorize([Permissions.PERMISSION_UPDATE_SERVICE]),
		AddServiceRecordValidation,
		addServiceRecord
	);
router
	.route('/:service_id/continue')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_SERVICE]),
		ContinueServiceValidation,
		continueService
	);
router
	.route('/:service_id/discontinue')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_SERVICE]),
		DiscontinueServiceValidation,
		disContinueService
	);
router
	.route('/:service_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_SERVICE]),
		DeleteServiceValidation,
		deleteService
	);
router
	.route('/:service_id/record/:valid_from')
	.delete(
		authorize([Permissions.PERMISSION_UPDATE_SERVICE]),
		DeleteServiceRecordValidation,
		deleteServiceRecord
	);
router
	.route('/:service_id/recover')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_SERVICE]),
		RecoverServiceValidation,
		recoverService
	);

export default router;
