import Logger from '../utils/logger.utils';
import AppDataSource from '../config/typeorm.config';

export const init = async () => {
	AppDataSource.initialize()
		.then(() => {
			Logger.debug(
				`MySQL connection initialized. Connected to DB: ${AppDataSource.options.database}`
			);
		})
		.catch((err) => {
			Logger.error('Error during data source initialization.', err);
			throw new Error('Unable to connect to DB.');
		});
};

export const destroy = async () => {
	if (AppDataSource.isInitialized) {
		AppDataSource.destroy()
			.then(() => {
				Logger.debug(
					`Disconnected from MYSQL DB: ${AppDataSource.options.database}`
				);
				process.exit(0);
			})
			.catch((err) => {
				Logger.error('Error during data source disconnection.', err);
				throw new Error('Error disconnecting from DB');
			});
	} else {
		Logger.debug('Database connection never initialized.');
	}
};
