import { Router } from 'express';
import LoginRoute from './public/login.route';
import AcupunctureReportRoutes from './private/acupuncture-report.routes';
import AuthenticateRoutes from './private/authenticate.routes';
import CustomerRoutes from './private/customer.routes';
import EmployeeRoutes from './private/employee.routes';
import GiftCardRoutes from './private/gift-card.routes';
import PayrollRoutes from './private/payroll.routes';
import ProfileRoutes from './private/profile.routes';
import ReservationRoutes from './private/reservation.routes';
import ScheduleRoutes from './private/schedule.routes';
import ServiceRoutes from './private/service.routes';
import VipPackageRoutes from './private/vip-package.routes';

const router = Router();

router.use('/login', LoginRoute);
router.use('/authenticate', AuthenticateRoutes);

router.use('/acupuncture-report', AcupunctureReportRoutes);
router.use('/customer', CustomerRoutes);
router.use('/employee', EmployeeRoutes);
router.use('/gift-card', GiftCardRoutes);
router.use('/payroll', PayrollRoutes);
router.use('/profile', ProfileRoutes);
router.use('/reservation', ReservationRoutes);
router.use('/schedule', ScheduleRoutes);
router.use('/service', ServiceRoutes);
router.use('/vip-package', VipPackageRoutes);

router.get('/health', (req, res) => {
	res.status(200).send('ok');
});

export default router;
