import { CustomError, HttpCode } from './custom-error';

export class ForbiddenError extends CustomError {
	statusCode = HttpCode.FORBIDDEN;
	constructor(private reason?: string) {
		super();
		Object.setPrototypeOf(this, ForbiddenError.prototype);
	}
	formatErrors() {
		return this.reason
			? `Forbidden Error: ${this.reason}`
			: 'Forbidden Error: Missing Permission';
	}
}
