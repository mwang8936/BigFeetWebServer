import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ScheduleServices from '../services/schedule.services';
import * as ProfileServices from '../services/profile.services';
import { AuthorizationError } from '../exceptions/authorization-error';
import { validateToken } from '../utils/jwt.utils';
import { formatDateToYYYYMMDD } from '../utils/date.utils';
import {
	ScheduleEventMessage,
	schedules_channel,
	sign_schedule_event,
} from '../events/schedule.events';
import pusher from '../config/pusher.config';

export const getProfile: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let jwt = req.headers.authorization;
		if (!jwt)
			throw new AuthorizationError(undefined, 'No authorization found.');
		if (jwt.toLowerCase().startsWith('bearer')) {
			jwt = jwt.slice('bearer'.length).trim();
		}

		const decodedToken = await validateToken(jwt);
		const employeeId = decodedToken.employee_id;

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
		let jwt = req.headers.authorization;
		if (!jwt)
			throw new AuthorizationError(undefined, 'No authorization found.');
		if (jwt.toLowerCase().startsWith('bearer')) {
			jwt = jwt.slice('bearer'.length).trim();
		}

		const decodedToken = await validateToken(jwt);
		const employeeId = decodedToken.employee_id;

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
		let jwt = req.headers.authorization;
		if (!jwt)
			throw new AuthorizationError(undefined, 'No authorization found.');
		if (jwt.toLowerCase().startsWith('bearer')) {
			jwt = jwt.slice('bearer'.length).trim();
		}

		const decodedToken = await validateToken(jwt);
		const employeeId = decodedToken.employee_id;

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
		let jwt = req.headers.authorization;
		if (!jwt)
			throw new AuthorizationError(undefined, 'No authorization found.');
		if (jwt.toLowerCase().startsWith('bearer')) {
			jwt = jwt.slice('bearer'.length).trim();
		}

		const decodedToken = await validateToken(jwt);
		const employeeId = decodedToken.employee_id;

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

			const message: ScheduleEventMessage = {
				employee_id: schedule.employee.employee_id,
				username: schedule.employee.username,
			};

			if (schedule.date === formatDateToYYYYMMDD(new Date().toISOString())) {
				pusher.trigger(schedules_channel, sign_schedule_event, message, {
					socket_id: req.body.socket_id,
				});
			}
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
