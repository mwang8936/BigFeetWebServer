import * as dotenv from 'dotenv';

import Pusher from 'pusher';

dotenv.config();

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID ?? '',
	key: process.env.PUSHER_KEY ?? '',
	secret: process.env.PUSHER_SECRET ?? '',
	cluster: process.env.PUSHER_CLUSTER ?? '',
});

export default pusher;
