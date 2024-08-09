import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ScheduleServices from '../services/schedule.services';
import * as ProfileServices from '../services/profile.services';
import { formatDateToYYYYMMDD } from '../utils/date.utils';
import pusher from '../config/pusher.config';
import {
	schedules_channel,
	update_schedule_event,
} from '../events/schedule.events';

export const getProfile: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.body.socket_id;

		const employee = await ProfileServices.getProfile(employeeId);

		if (employee) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(employee));
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

export const getProfileSchedules: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.body.socket_id;

		const schedules = await ProfileServices.getProfileSchedules(employeeId);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(schedules));
	} catch (err) {
		next(err);
	}
};

export const updateProfile: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.body.socket_id;

		const profile = await ProfileServices.updateProfile(
			employeeId,
			req.body.language,
			req.body.dark_mode
		);

		if (profile) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(profile));
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

export const signProfileSchedule: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.body.socket_id;

		const date = formatDateToYYYYMMDD(req.params.date);

		let schedule = await ScheduleServices.getSchedule(date, employeeId);

		if (!schedule) {
			await ScheduleServices.createSchedule(date, employeeId);
		}

		schedule = await ProfileServices.signProfileSchedule(date, employeeId);

		if (schedule) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(schedule));

			pusher.trigger(schedules_channel, update_schedule_event, schedule, {
				socket_id: employeeId,
			});
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
