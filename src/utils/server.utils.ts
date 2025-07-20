import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

import { BadRouteError } from '../exceptions/bad-route-error';
import ErrorHandler from '../middleware/error-handler.middleware';
import morganMiddleware from '../middleware/logger.middleware';
import routes from '../routes/routes';

function createServer() {
	const app = express();

	i18next.use(Backend).init({
		fallbackLng: 'en',
		preload: ['en', 'cn_simp', 'cn_trad'],
		backend: {
			loadPath: './src/locales/{{lng}}/translation.json',
		},
		debug: process.env.NODE_ENV !== 'production',
	});

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(cookieParser());

	app.use(morganMiddleware);
	app.use(compression());
	app.use(helmet());
	app.use(
		cors({
			origin: (origin, callback) => {
				// Allow requests with no origin (like mobile apps or curl)
				// or reflect the origin back
				callback(null, origin || true);
			},
			credentials: true,
		})
	);

	app.use('/api/', routes);

	app.use('*', (req, res) => {
		throw new BadRouteError();
	});

	app.use(ErrorHandler);

	return app;
}

export default createServer;
