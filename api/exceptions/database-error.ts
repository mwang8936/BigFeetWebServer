import { QueryFailedError } from 'typeorm';
import { CustomError, HttpCode } from './custom-error';

export class DatabaseError extends CustomError {
	statusCode = HttpCode.INTERNAL_SERVER_ERROR;
	constructor(public error: QueryFailedError) {
		super();
		Object.setPrototypeOf(this, DatabaseError.prototype);
	}
	formatErrors() {
		return 'A database error occurred.';
	}
}
