import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ProfileServices from '../services/profile.services';
import { AuthorizationError } from '../exceptions/authorization-error';
import { validateToken } from '../utils/jwt.utils';

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
			res.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(employee));
		} else {
			res.status(HttpCode.NOT_FOUND)
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

		res.status(HttpCode.OK)
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

		const updated = await ProfileServices.updateProfile(
			employeeId,
			req.body.language,
			req.body.dark_mode
		);

		if (!updated.affected) {
			res.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		} else {
			res.status(HttpCode.NO_CONTENT)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
