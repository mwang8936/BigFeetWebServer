import { CustomError, HttpCode } from './custom-error';

export class RecordAlreadyDiscontinuedError extends CustomError {
	statusCode = HttpCode.CONFLICT;
	constructor(
		public objectName: string,
		public id: string | number,
		public date: string
	) {
		super();
		Object.setPrototypeOf(this, RecordAlreadyDiscontinuedError.prototype);
	}
	formatErrors() {
		return `This ${this.objectName} with ID: ${this.id} has been discontinued since: ${this.date}`;
	}
}
