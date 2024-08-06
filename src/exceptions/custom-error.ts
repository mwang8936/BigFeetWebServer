export enum HttpCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	NOT_MODIFIED = 304,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	TOO_MANY_REQUESTS = 429,
	INTERNAL_SERVER_ERROR = 500,
}

export abstract class CustomError extends Error {
	constructor() {
		super();
		Object.setPrototypeOf(this, CustomError.prototype);
	}
	abstract statusCode: HttpCode;
	abstract formatErrors(): string | string[];
}
