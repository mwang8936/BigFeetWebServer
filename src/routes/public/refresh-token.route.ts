import { Router } from 'express';
import { refreshToken } from '../../controllers/refresh-token.controller';

const router = Router();

router.route('/').post(refreshToken);

export default router;
