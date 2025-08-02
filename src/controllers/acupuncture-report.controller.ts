import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as AcupunctureReportServices from '../services/acupuncture-report';
import { PayrollPart } from '../models/enums';
import { convertDateToYearMonthDayObject } from '../utils/date.utils';
import { AcupunctureReport } from '../models/acupuncture-report.models';
import {
	acupuncture_reports_channel,
	AcupunctureReportEventMessage,
	add_acupuncture_report_event,
	delete_acupuncture_report_event,
	update_acupuncture_report_event,
} from '../events/acupuncture-report.events';
import pusher from '../config/pusher.config';

const sendPusherEvent = async (
	acupunctureReport: AcupunctureReport,
	event: string,
	socketID: string | undefined
) => {
	if (socketID) {
		const message: AcupunctureReportEventMessage = {
			username: acupunctureReport.employee.username,
		};

		try {
			pusher.trigger(acupuncture_reports_channel, event, message, {
				socket_id: socketID,
			});
		} catch (err) {
			if (
				err instanceof Error &&
				(err.message?.includes('Invalid socket id') ||
					err.message?.includes('Invalid channel name'))
			) {
				console.error(err.message);
			}
		}
	}
};

export const getAcupunctureReports: RequestHandler = async (
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

		const acupunctureReports =
			await AcupunctureReportServices.getAcupunctureReports(
				start,
				end,
				employeeIds
			);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(acupunctureReports));
	} catch (err) {
		next(err);
	}
};

export const getAcupunctureReport: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const year = parseInt(req.params.year);
		const month = parseInt(req.params.month);
		const employeeId = parseInt(req.params.employee_id);

		const acupunctureReport =
			await AcupunctureReportServices.getAcupunctureReport(
				year,
				month,
				employeeId
			);

		if (acupunctureReport) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(acupunctureReport));
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

export const updateAcupunctureReport: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const year = parseInt(req.params.year);
		const month = parseInt(req.params.month);
		const employeeId = parseInt(req.params.employee_id);

		const acupunctureReport =
			await AcupunctureReportServices.updateAcupunctureReport(
				year,
				month,
				employeeId,
				req.body.acupuncture_percentage,
				req.body.massage_percentage,
				req.body.insurance_percentage,
				req.body.non_acupuncturist_insurance_percentage
			);

		if (acupunctureReport) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(acupunctureReport));

			sendPusherEvent(
				acupunctureReport,
				update_acupuncture_report_event,
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

export const addAcupunctureReport: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const acupunctureReport =
			await AcupunctureReportServices.createAcupunctureReport(
				req.body.year,
				req.body.month,
				req.body.employee_id,
				req.body.acupuncture_percentage,
				req.body.massage_percentage,
				req.body.insurance_percentage,
				req.body.non_acupuncturist_insurance_percentage
			);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(acupunctureReport));

		sendPusherEvent(
			acupunctureReport,
			add_acupuncture_report_event,
			req.headers['x-socket-id'] as string | undefined
		);
	} catch (err) {
		next(err);
	}
};

export const deleteAcupunctureReport: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const year = parseInt(req.params.year);
		const month = parseInt(req.params.month);
		const employeeId = parseInt(req.params.employee_id);

		const acupunctureReport =
			await AcupunctureReportServices.deleteAcupunctureReport(
				year,
				month,
				employeeId
			);

		if (acupunctureReport) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(acupunctureReport));

			sendPusherEvent(
				acupunctureReport,
				delete_acupuncture_report_event,
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
