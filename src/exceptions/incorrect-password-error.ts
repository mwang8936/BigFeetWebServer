import { CustomError, HttpCode } from './custom-error';

export class IncorrectPasswordError extends CustomError {
	statusCode = HttpCode.FORBIDDEN;
	constructor(username?: string) {
		super();
		this.message = username
			? `Incorrect password for user: ${username}.`
			: 'Username could not be found.';
		Object.setPrototypeOf(this, IncorrectPasswordError.prototype);
	}
	formatErrors() {
		return this.message;
	}
}
