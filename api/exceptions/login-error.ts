import { CustomError, HttpCode } from './custom-error';

export class LoginError extends CustomError {
	statusCode = HttpCode.UNAUTHORIZED;
	constructor(username?: string) {
		super();
		this.message = username
			? `Incorrect password for user: ${username}.`
			: 'Username could not be found.';
		Object.setPrototypeOf(this, LoginError.prototype);
	}
	formatErrors() {
		return this.message;
	}
}
