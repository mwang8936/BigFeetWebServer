import { CustomError, HttpCode } from './custom-error';

export class BadRouteError extends CustomError {
	statusCode = HttpCode.NOT_FOUND;
	constructor() {
		super();
		Object.setPrototypeOf(this, BadRouteError.prototype);
	}
	formatErrors() {
		return 'This route does not exist.';
	}
}
