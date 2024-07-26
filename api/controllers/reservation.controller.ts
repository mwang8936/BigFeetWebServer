import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ReservationServices from '../services/reservation.services';
import { formatDateToYYYYMMDD, validateDateString } from '../utils/date.utils';

export const getReservations: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: Date | undefined = validateDateString(
			req.query.start as string | undefined
		);
		const end: Date | undefined = validateDateString(
			req.query.end as string | undefined
		);
		const employeeIds: number[] | undefined = (req.query
			.employee_ids as string[])
			? (req.query.employee_ids as string[]).map((employee_id) =>
					parseInt(employee_id)
			  )
			: undefined;

		const reservations = await ReservationServices.getReservations(
			start,
			end,
			employeeIds
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(reservations));
	} catch (err) {
		next(err);
	}
};

export const getReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservationId = parseInt(req.params.reservation_id);

		const reservation = await ReservationServices.getReservation(reservationId);

		if (reservation) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(reservation));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const updateReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservationId = parseInt(req.params.reservation_id);

		const reservedDate: Date | undefined = validateDateString(
			req.body.reserved_date
		);
		const date: string | undefined = reservedDate
			? formatDateToYYYYMMDD(req.body.reserved_date)
			: undefined;
		const employeeId: number | undefined = req.body.employee_id;

		const reservation = await ReservationServices.updateReservation(
			reservationId,
			req.body.updated_by,
			reservedDate,
			date,
			employeeId,
			req.body.service_id,
			req.body.phone_number,
			req.body.customer_name,
			req.body.notes,
			req.body.requested_gender,
			req.body.requested_employee,
			req.body.cash,
			req.body.machine,
			req.body.vip,
			req.body.gift_card,
			req.body.insurance,
			req.body.tips,
			req.body.tip_method,
			req.body.message
		);

		if (reservation) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(reservation.schedule));
		} else {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const addReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservedDate = new Date(req.body.reserved_date);
		const date = formatDateToYYYYMMDD(req.body.reserved_date);
		const employeeId = req.body.employee_id;

		const reservation = await ReservationServices.createReservation(
			reservedDate,
			date,
			employeeId,
			req.body.service_id,
			req.body.created_by,
			req.body.phone_number,
			req.body.customer_name,
			req.body.notes,
			req.body.requested_gender,
			req.body.requested_employee,
			req.body.message
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(reservation.schedule));
	} catch (err) {
		next(err);
	}
};

export const deleteReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservationId = parseInt(req.params.reservation_id);

		const reservation = await ReservationServices.deleteReservation(
			reservationId
		);

		if (reservation) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(reservation));
		} else {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
