import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ProfileServices from '../services/profile.services';
import { AuthorizationError } from '../exceptions/authorization-error';
import { validateToken } from '../utils/jwt.utils';
import {
	convertDateToYearMonthDayObject,
	formatDateToYYYYMMDD,
} from '../utils/date.utils';
import {
	ScheduleEventMessage,
	schedules_channel,
	sign_schedule_event,
} from '../events/schedule.events';
import pusher from '../config/pusher.config';
import { getEmployeeHashedPassword } from '../services/employee.services';
import saltRounds from '../config/password.config';
import { IncorrectPasswordError } from '../exceptions/incorrect-password-error';
import { Schedule } from '../models/schedule.models';

const sendPusherEvent = async (
	schedule: Schedule,
	event: string,
	socketID: string | undefined
) => {
	if (
		socketID &&
		schedule.date === formatDateToYYYYMMDD(new Date().toISOString())
	) {
		const message: ScheduleEventMessage = {
			employee_id: schedule.employee.employee_id,
			username: schedule.employee.username,
		};

		pusher.trigger(schedules_channel, event, message, {
			socket_id: socketID,
		});
	}
};

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

		const start: { year: number; month: number; day: number } | undefined = req
			.query.start
			? convertDateToYearMonthDayObject(req.query.start as string)
			: undefined;
		const end: { year: number; month: number; day: number } | undefined = req
			.query.end
			? convertDateToYearMonthDayObject(req.query.end as string)
			: undefined;

		const schedules = await ProfileServices.getProfileSchedules(
			employeeId,
			start,
			end
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(schedules));
	} catch (err) {
		next(err);
	}
};

export const getProfilePayrolls: RequestHandler = async (
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

		const start: { year: number; month: number; day: number } | undefined = req
			.query.start
			? convertDateToYearMonthDayObject(req.query.start as string)
			: undefined;
		const end: { year: number; month: number; day: number } | undefined = req
			.query.end
			? convertDateToYearMonthDayObject(req.query.end as string)
			: undefined;

		const payrolls = await ProfileServices.getProfilePayrolls(
			employeeId,
			start,
			end
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(payrolls));
	} catch (err) {
		next(err);
	}
};

export const getProfileAcupunctureReports: RequestHandler = async (
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

		const start: { year: number; month: number; day: number } | undefined = req
			.query.start
			? convertDateToYearMonthDayObject(req.query.start as string)
			: undefined;
		const end: { year: number; month: number; day: number } | undefined = req
			.query.end
			? convertDateToYearMonthDayObject(req.query.end as string)
			: undefined;

		const acupunctureReports =
			await ProfileServices.getProfileAcupunctureReports(
				employeeId,
				start,
				end
			);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(acupunctureReports));
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
			req.body.language
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

export const changeProfilePassword: RequestHandler = async (
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

		const account = await getEmployeeHashedPassword(employeeId);
		if (account == null) throw new IncorrectPasswordError();

		const hashedPassword = account.password;

		const passwordMatch = await bcrypt.compare(
			req.body.old_password,
			hashedPassword
		);
		if (!passwordMatch) throw new IncorrectPasswordError(account.username);

		const newHashedPassword = await bcrypt.hash(
			req.body.new_password,
			saltRounds
		);

		const profile = await ProfileServices.changeProfilePassword(
			employeeId,
			newHashedPassword
		);

		if (profile) {
			const respProfile = Object(profile);
			delete respProfile['password'];

			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(respProfile));
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

		const date = convertDateToYearMonthDayObject(req.params.date);

		const schedule = await ProfileServices.signProfileSchedule(
			date,
			employeeId
		);

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
