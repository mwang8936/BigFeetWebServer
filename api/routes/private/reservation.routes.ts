import { Router } from 'express';
import {
	addReservation,
	deleteReservation,
	getReservation,
	getReservations,
	updateReservation,
} from '../../controllers/reservation.controller';
import authorize from '../../middleware/authentication.middleware';
import { Permissions } from '../../models/enums';
import {
	AddReservationValidation,
	DeleteReservationValidation,
	GetReservationValidation,
	GetReservationsValidation,
	UpdateReservationValidation,
} from '../../middleware/validation/reservation.validation';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_RESERVATION]),
		GetReservationsValidation,
		getReservations
	);
router
	.route('/:reservation_id')
	.get(
		authorize([Permissions.PERMISSION_GET_RESERVATION]),
		GetReservationValidation,
		getReservation
	);
router
	.route('/:reservation_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_RESERVATION]),
		UpdateReservationValidation,
		updateReservation
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_RESERVATION]),
		AddReservationValidation,
		addReservation
	);
router
	.route('/:reservation_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_RESERVATION]),
		DeleteReservationValidation,
		deleteReservation
	);

export default router;
