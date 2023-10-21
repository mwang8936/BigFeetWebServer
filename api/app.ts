import ENV_VARIABLES from './config/env.config';
import Logger from './utils/logger.utils';
import * as MySQLConnector from './utils/mysql-connector.utils';
import createServer from './utils/server.utils';
import terminate from './utils/shutdown.utils';

const PORT = ENV_VARIABLES.PORT;
const HOSTNAME = ENV_VARIABLES.HOSTNAME;

const app = createServer();

const server = app.listen(PORT, HOSTNAME, async () => {
	Logger.debug(`Listening on port: ${PORT} and host: ${HOSTNAME}`);
	await MySQLConnector.init();
});

const exitHandler = terminate(server);

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
