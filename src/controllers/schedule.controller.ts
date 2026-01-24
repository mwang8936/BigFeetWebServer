import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ScheduleServices from '../services/schedule.services';
import {
	convertDateToYearMonthDayObject,
	formatDateToYYYYMMDD,
	validateDateString,
} from '../utils/date.utils';
import pusher from '../config/pusher.config';
import {
	add_schedule_event,
	delete_schedule_event,
	ScheduleEventMessage,
	schedules_channel,
	sign_schedule_event,
	update_schedule_event,
} from '../events/schedule.events';
import { getEmployeeHashedPassword } from '../services/employee.services';
import { IncorrectPasswordError } from '../exceptions/incorrect-password-error';
import { Schedule } from '../models/schedule.models';

const sendPusherEvent = async (
	schedule: Schedule,
	event: string,
	socketID: string | undefined
) => {
	const currDate = new Date();
	if (
		socketID &&
		schedule.year === currDate.getFullYear() &&
		schedule.month === currDate.getMonth() + 1 &&
		schedule.day === currDate.getDate()
	) {
		const message: ScheduleEventMessage = {
			employee_id: schedule.employee.employee_id,
			username: schedule.employee.username,
		};

		try {
			await pusher.trigger(schedules_channel, event, message, {
				socket_id: socketID,
			});
		} catch (err) {
			if (err instanceof Error) {
				console.error('Pusher error:', err.message);
			}
		}
	}
};

export const getSchedules: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: { year: number; month: number; day: number } | undefined = req
			.query.start
			? convertDateToYearMonthDayObject(req.query.start as string)
			: undefined;
		const end: { year: number; month: number; day: number } | undefined = req
			.query.end
			? convertDateToYearMonthDayObject(req.query.end as string)
			: undefined;
		const employeeIds: number[] | undefined = (req.query
			.employee_ids as string[])
			? (req.query.employee_ids as string[]).map((employee_id) =>
					parseInt(employee_id)
			  )
			: undefined;

		const schedules = await ScheduleServices.getSchedules(
			start,
			end,
			employeeIds
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(schedules));
	} catch (err) {
		next(err);
	}
};

export const getSchedule: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date = convertDateToYearMonthDayObject(req.params.date);
		const employeeId = parseInt(req.params.employee_id);

		const schedule = await ScheduleServices.getSchedule(date, employeeId);

		if (schedule) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(schedule));
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

export const updateSchedule: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date = convertDateToYearMonthDayObject(req.params.date);
		const employeeId = parseInt(req.params.employee_id);

		const start =
			req.body.start === null
				? null
				: validateDateString(req.body.start as string | undefined);
		const end =
			req.body.end === null
				? null
				: validateDateString(req.body.end as string | undefined);

		const schedule = await ScheduleServices.updateSchedule(
			date,
			employeeId,
			req.body.is_working,
			req.body.on_call,
			start,
			end,
			req.body.priority,
			req.body.add_award
		);

		if (schedule) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(schedule));

			sendPusherEvent(
				schedule,
				update_schedule_event,
				req.headers['x-socket-id'] as string | undefined
			);
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

export const signSchedule: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date = convertDateToYearMonthDayObject(req.params.date);
		const employeeId = parseInt(req.params.employee_id);

		const account = await getEmployeeHashedPassword(employeeId);
		if (account == null) throw new IncorrectPasswordError();

		const hashedPassword = account.password;
		const passwordMatch = await bcrypt.compare(
			req.body.password,
			hashedPassword
		);
		if (!passwordMatch) throw new IncorrectPasswordError(account.username);

		const schedule = await ScheduleServices.signSchedule(date, employeeId);

		if (schedule) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(schedule));

			sendPusherEvent(
				schedule,
				sign_schedule_event,
				req.headers['x-socket-id'] as string | undefined
			);
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

export const addSchedule: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date = convertDateToYearMonthDayObject(req.body.date);

		const start =
			req.body.start === null
				? null
				: validateDateString(req.body.start as string | undefined);
		const end =
			req.body.end === null
				? null
				: validateDateString(req.body.end as string | undefined);

		const schedule = await ScheduleServices.createSchedule(
			date,
			req.body.employee_id,
			req.body.is_working,
			req.body.on_call,
			start,
			end,
			req.body.priority,
			req.body.add_award
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(schedule));

		sendPusherEvent(
			schedule,
			add_schedule_event,
			req.headers['x-socket-id'] as string | undefined
		);
	} catch (err) {
		next(err);
	}
};

export const deleteSchedule: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date = convertDateToYearMonthDayObject(req.params.date);
		const employeeId = parseInt(req.params.employee_id);

		const schedule = await ScheduleServices.deleteSchedule(date, employeeId);

		if (schedule) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(schedule));

			sendPusherEvent(
				schedule,
				delete_schedule_event,
				req.headers['x-socket-id'] as string | undefined
			);
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
