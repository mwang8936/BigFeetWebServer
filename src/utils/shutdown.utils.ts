import { Server } from 'http';
import Logger from './logger.utils';
import * as MySQLConnector from './mysql-connector.utils';
import ENV_VARIABLES from '../config/env.config';

const terminate = (
	server: Server,
	options = { coredump: false, timeout: 500 }
) => {
	return (code: number, reason: string) => (err: any, promise: any) => {
		if (err && err instanceof Error) {
			Logger.error(reason, err.message, err.stack);
			console.error(reason, err.message, err.stack);
		} else {
			if (ENV_VARIABLES.NODE_ENV === 'development') {
				Logger.debug(reason);
				console.error(reason);
			} else if (ENV_VARIABLES.NODE_ENV === 'production') {
				Logger.warn(reason);
				console.error(reason);
			} else {
				Logger.info(reason);
				console.error(reason);
			}
		}

		MySQLConnector.destroy();

		const exit = () => {
			options.coredump ? process.abort() : process.exit(code);
		};

		server.close(exit);
		setTimeout(exit, options.timeout);
	};
};

export default terminate;
