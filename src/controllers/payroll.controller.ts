import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as PayrollServices from '../services/payroll.services';
import { PayrollPart } from '../models/enums';
import { convertDateToYearMonthDayObject } from '../utils/date.utils';
import { Payroll } from '../models/payroll.models';
import {
	add_payroll_event,
	delete_payroll_event,
	PayrollEventMessage,
	payrolls_channel,
	update_payroll_event,
} from '../events/payroll.events';
import pusher from '../config/pusher.config';

const sendPusherEvent = async (
	payroll: Payroll,
	event: string,
	socketID: string | undefined
) => {
	if (socketID) {
		const message: PayrollEventMessage = {
			username: payroll.employee.username,
		};

		pusher.trigger(payrolls_channel, event, message, {
			socket_id: socketID,
		});
	}
};

export const getPayrolls: RequestHandler = async (
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

		const payrolls = await PayrollServices.getPayrolls(start, end, employeeIds);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(payrolls));
	} catch (err) {
		next(err);
	}
};

export const getPayroll: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const year = parseInt(req.params.year);
		const month = parseInt(req.params.month);
		const part: PayrollPart = parseInt(req.params.part);
		const employeeId = parseInt(req.params.employee_id);

		const payroll = await PayrollServices.getPayroll(
			year,
			month,
			part,
			employeeId
		);

		if (payroll) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(payroll));
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

export const updatePayroll: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const year = parseInt(req.params.year);
		const month = parseInt(req.params.month);
		const part: PayrollPart = parseInt(req.params.part);
		const employeeId = parseInt(req.params.employee_id);

		const payroll = await PayrollServices.updatePayroll(
			year,
			month,
			part,
			employeeId,
			req.body.option,
			req.body.cheque_amount
		);

		if (payroll) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(payroll));

			sendPusherEvent(
				payroll,
				update_payroll_event,
				req.headers['x-socket-id'] as string | undefined
			);
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

export const addPayroll: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const payroll = await PayrollServices.createPayroll(
			req.body.year,
			req.body.month,
			req.body.part,
			req.body.employee_id,
			req.body.option,
			req.body.cheque_amount
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(payroll));

		sendPusherEvent(
			payroll,
			add_payroll_event,
			req.headers['x-socket-id'] as string | undefined
		);
	} catch (err) {
		next(err);
	}
};

export const deletePayroll: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const year = parseInt(req.params.year);
		const month = parseInt(req.params.month);
		const part: PayrollPart = parseInt(req.params.part);
		const employeeId = parseInt(req.params.employee_id);

		const payroll = await PayrollServices.deletePayroll(
			year,
			month,
			part,
			employeeId
		);

		if (payroll) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(payroll));

			sendPusherEvent(
				payroll,
				delete_payroll_event,
				req.headers['x-socket-id'] as string | undefined
			);
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

export const refreshPayroll: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const year = parseInt(req.params.year);
		const month = parseInt(req.params.month);
		const part: PayrollPart = parseInt(req.params.part);
		const employeeId = parseInt(req.params.employee_id);

		const payroll = await PayrollServices.refreshPayroll(
			year,
			month,
			part,
			employeeId
		);

		if (payroll) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(payroll));

			sendPusherEvent(
				payroll,
				update_payroll_event,
				req.headers['x-socket-id'] as string | undefined
			);
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
