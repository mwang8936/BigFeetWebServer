import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import rateLimiter from '../config/rate-limiter.config';
import { HttpCode } from '../exceptions/custom-error';
import { LoginError } from '../exceptions/login-error';
import { TooManyRequestsError } from '../exceptions/too-many-requests-error';
import { getUserInfo } from '../services/login.services';
import {
	addRefreshToken,
	deleteRefreshToken,
	replaceRefreshToken,
} from '../services/refresh-token.services';
import {
	generateAccessToken,
	generateRefreshToken,
	validateRefreshToken,
} from '../utils/jwt.utils';
import saltRounds from '../config/password.config';

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

		const oldRefreshToken = req.cookies.refresh_token;
		const newRefreshToken = generateRefreshToken(employeeId);

		res.cookie('refresh_token', newRefreshToken, {
			httpOnly: true, // Makes cookie inaccessible to JavaScript (more secure)
			secure: process.env.NODE_ENV !== 'development', // Use only with HTTPS
			maxAge: 1000 * 60 * 60 * 24 * 7, // Expiration time (7 days)
			sameSite: 'strict', // CSRF protection
		});

		const newHashedRefreshToken = await bcrypt.hash(
			newRefreshToken,
			saltRounds
		);
		const newRefreshTokenExpiryDate = new Date(
			new Date().getTime() + 1000 * 60 * 60 * 24 * 7
		);

		if (oldRefreshToken) {
			const oldHashedRefreshToken = await bcrypt.hash(
				oldRefreshToken,
				saltRounds
			);
			await replaceRefreshToken(
				employeeId,
				oldHashedRefreshToken,
				newRefreshToken,
				newRefreshTokenExpiryDate
			);
		} else {
			await addRefreshToken(
				employeeId,
				newHashedRefreshToken,
				newRefreshTokenExpiryDate
			);
		}

		res.status(HttpCode.OK).json({
			user,
			accessToken: generateAccessToken(employeeId, permissions),
		});
	} catch (err) {
		next(err);
	}
};

export const logout: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies.refresh_token;
		if (refreshToken) {
			const decodedToken = await validateRefreshToken(refreshToken);

			const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);
			await deleteRefreshToken(decodedToken.employee_id, hashedRefreshToken);
		}

		res.status(HttpCode.OK).send();
	} catch (err) {
		next(err);
	}
};
