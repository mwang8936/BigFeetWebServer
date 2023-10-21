import { Router } from 'express';
import { login } from '../../controllers/login.controller';
import { LoginValidation } from '../../middleware/validation/login.validation';

const router = Router();

router.route('/').post(LoginValidation, login);

export default router;
