import { CustomError, HttpCode } from './custom-error';

export class ExistingRecordError extends CustomError {
	statusCode = HttpCode.CONFLICT;
	constructor(
		public objectName: string,
		public id: string | number,
		public date: string
	) {
		super();
		Object.setPrototypeOf(this, ExistingRecordError.prototype);
	}
	formatErrors() {
		return `${this.objectName} with ID: ${this.id} created on ${this.date} already exists.`;
	}
}
