import { Request, Response, NextFunction } from 'express';
import { CustomError, HttpCode } from '../exceptions/custom-error';
import { isCelebrateError } from 'celebrate';
import { ValidationError } from '../exceptions/validation-error';
import { QueryFailedError } from 'typeorm';
import { DatabaseError } from '../exceptions/database-error';
import {
	TokenExpiredError,
	JsonWebTokenError,
	NotBeforeError,
} from 'jsonwebtoken';
import { AuthorizationError } from '../exceptions/authorization-error';
import Logger from '../utils/logger.utils';

const ErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (isCelebrateError(err)) err = new ValidationError(err);
	else if (err instanceof QueryFailedError) err = new DatabaseError(err);
	else if (
		err instanceof TokenExpiredError ||
		err instanceof JsonWebTokenError ||
		err instanceof NotBeforeError
	)
		err = new AuthorizationError(err);
	if (err instanceof CustomError) {
		res.status(err.statusCode).send({
			error: HttpCode[err.statusCode].replaceAll('_', ' '),
			messages: err.formatErrors(),
		});
		Logger.error(err.formatErrors());
	} else {
		res.status(500).send({
			error: 'Something went wrong',
			message: err.message,
		});
		Logger.error(err.message);
	}
};

export default ErrorHandler;
