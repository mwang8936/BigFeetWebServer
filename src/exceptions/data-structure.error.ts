import { CustomError, HttpCode } from './custom-error';

export class DataStructureError extends CustomError {
	statusCode = HttpCode.CONFLICT;
	constructor(public objectName: string, public message: string) {
		super();
		Object.setPrototypeOf(this, DataStructureError.prototype);
	}
	formatErrors() {
		return `${this.objectName} error: ${this.message}`;
	}
}
