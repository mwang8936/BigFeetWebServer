import { Router } from 'express';
import { refresh } from '../../controllers/login.controller';

const router = Router();

router.route('/').post(refresh);

export default router;
