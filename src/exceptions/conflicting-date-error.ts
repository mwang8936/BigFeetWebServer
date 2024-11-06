import { CustomError, HttpCode } from './custom-error';

import { getNextDate } from '../utils/date.utils';

export class ConflictingRecordsError extends CustomError {
	statusCode = HttpCode.CONFLICT;
	constructor(
		public objectName: string,
		public id: string | number,
		public date: string
	) {
		super();
		Object.setPrototypeOf(this, ConflictingRecordsError.prototype);
	}
	formatErrors() {
		return `Cannot discontinue this ${this.objectName} with ID: ${
			this.id
		}. Earliest discontinue date is ${getNextDate(this.date)}`;
	}
}
