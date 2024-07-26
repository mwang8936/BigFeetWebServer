import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as EmployeeServices from '../services/employee.services';
import * as ScheduleServices from '../services/schedule.services';
import { VipPackage } from '../models/vip-package.models';
import { formatDateToYYYYMMDD, validateDateString } from '../utils/date.utils';

export const getSchedules: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: string | undefined = req.query.start
			? formatDateToYYYYMMDD(req.query.start as string)
			: undefined;
		const end: string | undefined = req.query.end
			? formatDateToYYYYMMDD(req.query.end as string)
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
		const date = formatDateToYYYYMMDD(req.params.date);
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
		const date = formatDateToYYYYMMDD(req.params.date);
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
			start,
			end,
			req.body.priority
		);

		if (schedule) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(schedule));
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
		const date = formatDateToYYYYMMDD(req.body.date);

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
			start,
			end,
			req.body.priority
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(schedule));
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
		const date = formatDateToYYYYMMDD(req.params.date);
		const employeeId = parseInt(req.params.employee_id);

		const schedule = await ScheduleServices.deleteSchedule(date, employeeId);

		if (schedule) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(schedule));
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
