import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { BadRouteError } from '../exceptions/bad-route-error';
import ErrorHandler from '../middleware/error-handler.middleware';
import morganMiddleware from '../middleware/logger.middleware';
import routes from '../routes/routes';

function createServer() {
	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(morganMiddleware);
	app.use(compression());
	app.use(helmet());
	app.use(cors());

	app.use('/api/', routes);

	app.use('*', (req, res) => {
		throw new BadRouteError();
	});

	app.use(ErrorHandler);

	return app;
}

export default createServer;
