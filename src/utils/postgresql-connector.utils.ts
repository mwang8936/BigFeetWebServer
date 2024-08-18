import Logger from './logger.utils';
import AppDataSource from '../config/orm.config';

export const init = async () => {
	AppDataSource.initialize()
		.then(() => {
			Logger.debug(
				`POSTGRESQL connection initialized. Connected to DB: ${AppDataSource.options.database}`
			);
		})
		.catch((err) => {
			Logger.error('Error during data source initialization.', err);
			throw new Error('Unable to connect to DB.');
		});
};

export const destroy = async () => {
	try {
		if (AppDataSource.isInitialized) {
			await AppDataSource.destroy();
			Logger.debug(
				`Disconnected from POSTGRESQL DB: ${AppDataSource.options.database}`
			);
		} else {
			Logger.debug('Database connection never initialized.');
		}
		process.exit(0);
	} catch (err) {
		Logger.error('Error during data source disconnection.', err);
		process.exit(1);
	}
};
