import { CustomError, HttpCode } from './custom-error';
import { VerifyErrors } from 'jsonwebtoken';

export class AuthorizationError extends CustomError {
	statusCode = HttpCode.UNAUTHORIZED;
	constructor(public error?: VerifyErrors, message?: string) {
		super();
		this.message = error?.message ?? message ?? 'Unknown.';
		Object.setPrototypeOf(this, AuthorizationError.prototype);
	}
	formatErrors() {
		return `Authentication Error: ${this.message}`;
	}
}
