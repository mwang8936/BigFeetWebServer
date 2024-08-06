import morgan, { StreamOptions } from 'morgan';
import { Request, Response } from 'express';

import ENV_VARIABLES from '../config/env.config';
import Logger from '../utils/logger.utils';

const stream: StreamOptions = {
	write: (message) => Logger.http(message),
};

const skip = () => {
	const env = ENV_VARIABLES.NODE_ENV;
	return env !== 'development';
};

morgan.token('body', (req: Request, res: Response) => {
	const body = req.body;
	if (body.password != null) body.password = '*'.repeat(body.password.length);
	return JSON.stringify(body);
});

const morganMiddleware = morgan(
	':method :url\nbody - :body\nresponse - :status :res[content-length] - :response-time ms',
	{ stream, skip }
);

export default morganMiddleware;
