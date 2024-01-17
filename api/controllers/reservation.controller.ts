import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ReservationServices from '../services/reservation.services';
import * as ScheduleServices from '../services/schedule.services';
import { convertDateToPSTDateTime, setTimeToZero } from '../utils/date.utils';

export const getReservations: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: Date | undefined = (req.query.start as string)
			? new Date(req.query.start as string)
			: undefined;
		const end: Date | undefined = (req.query.end as string)
			? new Date(req.query.end as string)
			: undefined;
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

		const date: Date | undefined = (req.body.reserved_date as string)
			? new Date(req.body.reserved_date as string)
			: undefined;
		const employeeId: number | undefined = req.body.employee_id;

		if (employeeId && date) {
			const schedule = await ScheduleServices.getSchedule(
				setTimeToZero(date),
				employeeId
			);

			if (!schedule) {
				await ScheduleServices.createSchedule(date, employeeId);
			}
		}

		const updated = await ReservationServices.updateReservation(
			reservationId,
			req.body.updated_by,
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
			req.body.tips,
			req.body.tip_method,
			req.body.message
		);

		if (!updated.affected) {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		} else {
			const reservation = await ReservationServices.getReservation(
				reservationId
			);
			if (reservation) {
				const schedule = await ScheduleServices.getSchedule(
					reservation.date,
					reservation.employee_id
				);
				if (schedule) {
					schedule.date = convertDateToPSTDateTime(schedule.date);
					res
						.status(HttpCode.CREATED)
						.header('Content-Type', 'application/json')
						.send(JSON.stringify(schedule));
				} else {
					res
						.status(HttpCode.NO_CONTENT)
						.header('Content-Type', 'application/json')
						.send();
				}
			} else {
				res
					.status(HttpCode.NO_CONTENT)
					.header('Content-Type', 'application/json')
					.send();
			}
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
		const date = new Date(req.body.reserved_date);
		const employeeId = req.body.employee_id;

		if (employeeId) {
			const schedule = await ScheduleServices.getSchedule(
				setTimeToZero(date),
				employeeId
			);

			if (!schedule) {
				await ScheduleServices.createSchedule(date, employeeId);
			}
		}

		await ReservationServices.createReservation(
			employeeId,
			date,
			req.body.service_id,
			req.body.created_by,
			req.body.phone_number,
			req.body.customer_name,
			req.body.notes,
			req.body.requested_gender,
			req.body.requested_employee,
			req.body.message
		);

		const schedule = await ScheduleServices.getSchedule(
			setTimeToZero(date),
			employeeId
		);

		if (schedule) {
			schedule.date = convertDateToPSTDateTime(schedule.date);
		}

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(schedule));
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

		const updated = await ReservationServices.deleteReservation(reservationId);

		if (!updated.affected) {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		} else {
			res
				.status(HttpCode.NO_CONTENT)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
