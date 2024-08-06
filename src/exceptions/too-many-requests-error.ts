import { CustomError, HttpCode } from './custom-error';

export class TooManyRequestsError extends CustomError {
	statusCode = HttpCode.TOO_MANY_REQUESTS;
	constructor() {
		super();
		Object.setPrototypeOf(this, TooManyRequestsError.prototype);
	}
	formatErrors() {
		return 'Too many requests.';
	}
}
