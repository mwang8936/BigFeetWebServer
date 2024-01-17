import { QueryFailedError } from 'typeorm';
import { CustomError, HttpCode } from './custom-error';

export class DatabaseError extends CustomError {
	statusCode = HttpCode.INTERNAL_SERVER_ERROR;
	constructor(public error: QueryFailedError) {
		super();
		if ((error.driverError.code = 'ER_DUP_ENTRY')) {
			this.statusCode = HttpCode.CONFLICT;
			const sqlMessage = error.driverError.sqlMessage as string;
			if (sqlMessage.includes('employees')) {
				const regexArray = sqlMessage.match(/'([^']+)'/);
				if (regexArray) {
					const username = regexArray[1];
					this.error.message = `User with username: '${username}' already exists.`;
				} else {
					this.error.message = 'User with username already exists.';
				}
			}
		}
		Object.setPrototypeOf(this, DatabaseError.prototype);
	}
	formatErrors() {
		if (this.statusCode == HttpCode.CONFLICT) return `${this.error.message}`;
		else return 'A database error occurred.';
	}
}
