import { CustomError, HttpCode } from './custom-error';

import { getNextDate } from '../utils/date.utils';

export class ConflictingReservationError extends CustomError {
	statusCode = HttpCode.CONFLICT;
	constructor(
		public objectName: string,
		public id: string | number,
		public date: string
	) {
		super();
		Object.setPrototypeOf(this, ConflictingReservationError.prototype);
	}
	formatErrors() {
		return `Cannot delete this ${this.objectName} with ID: ${
			this.id
		}. Active reservations are associated with it. Earliest discontinue date is ${getNextDate(
			this.date
		)}`;
	}
}
