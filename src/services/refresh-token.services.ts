import AppDataSource from '../config/orm.config';
import { RefreshToken } from '../models/refresh-token.models';

export const getRefreshToken = async (
	employeeId: number,
	hashedRefreshToken: string
) => {
	return RefreshToken.findOne({
		where: {
			employee: {
				employee_id: employeeId,
			},
			hashed_refresh_token: hashedRefreshToken,
		},
	});
};

export const addRefreshToken = async (
	employeeId: number,
	hashedRefreshToken: string,
	expiresAt: Date
) => {
	const refreshToken = RefreshToken.create({
		employee: {
			employee_id: employeeId,
		},
		hashed_refresh_token: hashedRefreshToken,
		expires_at: expiresAt,
	});

	return refreshToken.save();
};

export const deleteRefreshToken = async (
	employeeId: number,
	hashedRefreshToken: string
) => {
	return RefreshToken.delete({
		employee: {
			employee_id: employeeId,
		},
		hashed_refresh_token: hashedRefreshToken,
	});
};

export const replaceRefreshToken = async (
	employeeId: number,
	oldHashedRefreshToken: string,
	newHashedRefreshToken: string,
	expiresAt: Date
) => {
	const oldRefreshToken = await getRefreshToken(
		employeeId,
		oldHashedRefreshToken
	);

	const newRefreshToken = RefreshToken.create({
		employee: {
			employee_id: employeeId,
		},
		hashed_refresh_token: newHashedRefreshToken,
		expires_at: expiresAt,
	});

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		if (oldRefreshToken) {
			await transactionalEntityManager.remove(oldRefreshToken);
		}
		await transactionalEntityManager.save(newRefreshToken);
	});
};
