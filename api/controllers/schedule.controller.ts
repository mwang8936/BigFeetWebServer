import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as EmployeeServices from '../services/employee.services';
import * as ScheduleServices from '../services/schedule.services';
import { VipPackage } from '../models/vip-package.models';
import { convertDateToPSTDateTime, setTimeToZero } from '../utils/date.utils';

export const getSchedules: RequestHandler = async (
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

		const schedules = await ScheduleServices.getSchedules(
			start,
			end,
			employeeIds
		);

		schedules.forEach(
			(schedule) => (schedule.date = convertDateToPSTDateTime(schedule.date))
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
		const date = setTimeToZero(new Date(req.params.date));
		const employeeId = parseInt(req.params.employee_id);

		const schedule = await ScheduleServices.getSchedule(date, employeeId);

		if (schedule) {
			schedule.date = convertDateToPSTDateTime(schedule.date);
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
		const date = setTimeToZero(new Date(req.params.date));
		const employeeId = parseInt(req.params.employee_id);

		const updated = await ScheduleServices.updateSchedule(
			date,
			employeeId,
			req.body.is_working,
			req.body.start === undefined
				? undefined
				: req.body.start === null
				? null
				: new Date(req.body.start),
			req.body.end === undefined
				? undefined
				: req.body.end === null
				? null
				: new Date(req.body.end),
			req.body.vip_packages as VipPackage[]
		);

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

export const addSchedule: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const schedule = await ScheduleServices.createSchedule(
			new Date(req.body.date),
			req.body.employee_id,
			req.body.is_working,
			req.body.start === undefined
				? undefined
				: req.body.start === null
				? null
				: new Date(req.body.start),
			req.body.end === undefined
				? undefined
				: req.body.end === null
				? null
				: new Date(req.body.end),
			req.body.vip_packages as VipPackage[]
		);

		schedule.reservations = [];
		schedule.vip_packages = [];
		const employee = await EmployeeServices.getEmployee(schedule.employee_id);
		if (employee) schedule.employee = employee;
		if (schedule.is_working === undefined) schedule.is_working = false;
		if (schedule.signed === undefined) schedule.signed = false;

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
		const date = setTimeToZero(new Date(req.params.date));
		const employeeId = parseInt(req.params.employee_id);

		const updated = await ScheduleServices.deleteSchedule(date, employeeId);

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
