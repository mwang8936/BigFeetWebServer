import { Request, Response, NextFunction } from 'express';

import { ForbiddenError } from '../exceptions/forbidden-error';
import { Permissions } from '../models/enums';
import * as ReservationServices from '../services/reservation.services';
import {
	convertDateToYearMonthDayObject,
	isPastPSTDate,
} from '../utils/date.utils';

const MISSING_PERMISSION_REASON =
	'Missing Permission: reservations from previous days cannot be changed.';

const canEditPastReservations = (res: Response): boolean => {
	const permissions = (res.locals.permissions ?? []) as Permissions[];

	return permissions.includes(Permissions.PERMISSION_EDIT_PAST_RESERVATION);
};

// Validation runs before this middleware, so the reserved date has already been
// converted from its ISO string into a Date by the time it is read here.
const isPastReservedDate = (reservedDate: string | Date): boolean => {
	return isPastPSTDate(
		convertDateToYearMonthDayObject(new Date(reservedDate).toISOString())
	);
};

const isPastReservation = async (reservationId: number): Promise<boolean> => {
	const reservation = await ReservationServices.getReservation(reservationId);

	if (!reservation) return false;

	const { year, month, day } = reservation;

	return isPastPSTDate({ year, month, day });
};

/**
 * Blocks adding a reservation to a day that has already ended in PST unless the
 * caller has the edit past reservation permission.
 */
export const authorizeAddPastReservation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			!canEditPastReservations(res) &&
			isPastReservedDate(req.body.reserved_date)
		)
			throw new ForbiddenError(MISSING_PERMISSION_REASON);

		next();
	} catch (err) {
		next(err);
	}
};

/**
 * Blocks updating a reservation that falls on a day that has already ended in
 * PST, as well as moving a reservation onto such a day, unless the caller has
 * the edit past reservation permission.
 */
export const authorizeUpdatePastReservation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!canEditPastReservations(res)) {
			const reservationId = parseInt(req.params.reservation_id);

			if (await isPastReservation(reservationId))
				throw new ForbiddenError(MISSING_PERMISSION_REASON);

			if (
				req.body.reserved_date !== undefined &&
				isPastReservedDate(req.body.reserved_date)
			)
				throw new ForbiddenError(MISSING_PERMISSION_REASON);
		}

		next();
	} catch (err) {
		next(err);
	}
};

/**
 * Blocks deleting a reservation that falls on a day that has already ended in
 * PST unless the caller has the edit past reservation permission.
 */
export const authorizeDeletePastReservation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!canEditPastReservations(res)) {
			const reservationId = parseInt(req.params.reservation_id);

			if (await isPastReservation(reservationId))
				throw new ForbiddenError(MISSING_PERMISSION_REASON);
		}

		next();
	} catch (err) {
		next(err);
	}
};
