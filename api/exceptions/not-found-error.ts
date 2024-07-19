import { CustomError, HttpCode } from './custom-error';

export class NotFoundError extends CustomError {
	statusCode = HttpCode.NOT_FOUND;
	constructor(
		public objectName: string,
		public field: string,
		public id: string | number
	) {
		super();
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
	formatErrors() {
		return `${this.objectName} with ${this.field}: ${this.id} could not be found.`;
	}
}
