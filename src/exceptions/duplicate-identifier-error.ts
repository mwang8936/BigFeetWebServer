import { CustomError, HttpCode } from './custom-error';

export class DuplicateIdentifierError extends CustomError {
	statusCode = HttpCode.CONFLICT;
	constructor(
		public objectName: string,
		public field: string,
		public id: string | number
	) {
		super();
		Object.setPrototypeOf(this, DuplicateIdentifierError.prototype);
	}
	formatErrors() {
		return `${this.objectName} with ${this.field}: ${this.id} already exists.`;
	}
}
