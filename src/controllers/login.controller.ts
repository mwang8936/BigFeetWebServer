import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import rateLimiter from '../config/rate-limiter.config';
import { HttpCode } from '../exceptions/custom-error';
import { LoginError } from '../exceptions/login-error';
import { TooManyRequestsError } from '../exceptions/too-many-requests-error';
import { getUserInfo } from '../services/login.services';
import { generateToken } from '../utils/jwt.utils';

export const login: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await rateLimiter.consume(req.ip).catch(() => {
			throw new TooManyRequestsError();
		});

		const account = await getUserInfo(req.body.username);
		if (account == null) throw new LoginError();

		const hashedPassword = account.password;
		const passwordMatch = await bcrypt.compare(
			req.body.password,
			hashedPassword
		);
		if (!passwordMatch) throw new LoginError(account.username);

		const employeeId = account.employee_id;
		const permissions = account.permissions;

		const user = Object(account);
		delete user['password'];

		rateLimiter.delete(req.ip);

		res.status(HttpCode.OK).json({
			user,
			accessToken: generateToken(employeeId, permissions),
		});
	} catch (err) {
		next(err);
	}
};
