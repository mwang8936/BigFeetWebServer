import { Request, Response, NextFunction } from 'express';
import { validateAccessToken } from '../utils/jwt.utils';
import { Permissions } from '../models/enums';
import { AuthorizationError } from '../exceptions/authorization-error';
import { ForbiddenError } from '../exceptions/forbidden-error';

const authorize =
	(requiredPermissions: Permissions[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			let jwt = req.headers.authorization;

			if (!jwt)
				throw new AuthorizationError(undefined, 'No authorization found.');

			if (jwt.toLowerCase().startsWith('bearer')) {
				jwt = jwt.slice('bearer'.length).trim();
			}

			const decodedToken = await validateAccessToken(jwt);

			if (requiredPermissions.length > 0) {
				const hasAccessToEndpoint = requiredPermissions.every(
					(reqPermission) => {
						return decodedToken.permissions.includes(reqPermission);
					}
				);

				if (!hasAccessToEndpoint) throw new ForbiddenError();
			}

			next();
		} catch (err) {
			next(err);
		}
	};

export default authorize;
