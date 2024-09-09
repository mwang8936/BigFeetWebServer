import { CustomError, HttpCode } from './custom-error';

export class MissingRecordError extends CustomError {
	statusCode = HttpCode.NOT_FOUND;
	constructor(
		public objectName: string,
		public id: string | number,
		public date: string
	) {
		super();
		Object.setPrototypeOf(this, MissingRecordError.prototype);
	}
	formatErrors() {
		return `Valid ${this.objectName} with ID: ${this.id} before ${this.date} could not be found.`;
	}
}
