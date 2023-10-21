import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';

export const authenticate: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		res.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send();
	} catch (err) {
		next(err);
	}
};
