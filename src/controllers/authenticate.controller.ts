import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import pusher from '../config/pusher.config';
import { AuthorizationError } from '../exceptions/authorization-error';
import { validateAccessToken } from '../utils/jwt.utils';
import { customers_channel } from '../events/customer.events';
import { Permissions } from '../models/enums';
import { employees_channel } from '../events/employee.events';
import { gift_cards_channel } from '../events/gift-card.events';
import { schedules_channel } from '../events/schedule.events';
import { services_channel } from '../events/service.events';
import { acupuncture_reports_channel } from '../events/acupuncture-report.events';
import { payrolls_channel } from '../events/payroll.events';

export const authenticate: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		res.status(HttpCode.OK).header('Content-Type', 'application/json').send();
	} catch (err) {
		next(err);
	}
};

export const authenticatePusher: RequestHandler = async (
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

		const decodedToken = await validateAccessToken(jwt);

		const employeeId = decodedToken.employee_id;
		const permissions = decodedToken.permissions;

		const socketId: string = req.body.socket_id;
		const channel: string = req.body.channel_name;

		if (
			channel === acupuncture_reports_channel &&
			!permissions.includes(Permissions.PERMISSION_GET_PAYROLL)
		) {
			throw new AuthorizationError(
				undefined,
				'Pusher acupuncture-report authorization not found.'
			);
		}

		if (
			channel === customers_channel &&
			!permissions.includes(Permissions.PERMISSION_GET_CUSTOMER)
		) {
			throw new AuthorizationError(
				undefined,
				'Pusher customer authorization not found.'
			);
		}

		if (
			channel === employees_channel &&
			!permissions.includes(Permissions.PERMISSION_GET_EMPLOYEE)
		) {
			throw new AuthorizationError(
				undefined,
				'Pusher employee authorization not found.'
			);
		}

		if (
			channel === gift_cards_channel &&
			!permissions.includes(Permissions.PERMISSION_GET_GIFT_CARD)
		) {
			throw new AuthorizationError(
				undefined,
				'Pusher gift-card authorization not found.'
			);
		}

		if (
			channel === payrolls_channel &&
			!permissions.includes(Permissions.PERMISSION_GET_PAYROLL)
		) {
			throw new AuthorizationError(
				undefined,
				'Pusher payroll authorization not found.'
			);
		}

		if (
			channel === schedules_channel &&
			!permissions.includes(Permissions.PERMISSION_GET_SCHEDULE)
		) {
			throw new AuthorizationError(
				undefined,
				'Pusher schedule authorization not found.'
			);
		}

		if (
			channel === services_channel &&
			!permissions.includes(Permissions.PERMISSION_GET_SERVICE)
		) {
			throw new AuthorizationError(
				undefined,
				'Pusher service authorization not found.'
			);
		}

		const auth = pusher.authorizeChannel(socketId, channel, {
			user_id: employeeId.toString(),
		});

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(auth));
	} catch (err) {
		next(err);
	}
};
