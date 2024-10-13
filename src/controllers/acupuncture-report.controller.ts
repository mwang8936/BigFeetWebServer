import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as AcupunctureReportServices from '../services/acupuncture-report';
import { PayrollPart } from '../models/enums';
import { convertDateToYearMonthDayObject } from '../utils/date.utils';

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
				req.body.insurance_percentage
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
				req.body.insurance_percentage
			);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(acupunctureReport));
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
