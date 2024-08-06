import { CustomError, HttpCode } from './custom-error';

export class ForbiddenError extends CustomError {
	statusCode = HttpCode.FORBIDDEN;
	constructor() {
		super();
		Object.setPrototypeOf(this, ForbiddenError.prototype);
	}
	formatErrors() {
		return 'Forbidden Error: Missing Permission';
	}
}
