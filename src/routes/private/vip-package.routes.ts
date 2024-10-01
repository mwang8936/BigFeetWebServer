import { Router } from 'express';
import { Permissions } from '../../models/enums';
import {
	addVipPackage,
	deleteVipPackage,
	getVipPackage,
	getVipPackages,
	updateVipPackage,
} from '../../controllers/vip-packages.controller';
import {
	AddVipPackageValidation,
	DeleteVipPackageValidation,
	GetVipPackageValidation,
	GetVipPackagesValidation,
	UpdateVipPackageValidation,
} from '../../middleware/validation/vip-packages.validation';
import authorize from '../../middleware/authentication.middleware';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_VIP_PACKAGE]),
		GetVipPackagesValidation,
		getVipPackages
	);
router
	.route('/:vip_package_id')
	.get(
		authorize([Permissions.PERMISSION_GET_VIP_PACKAGE]),
		GetVipPackageValidation,
		getVipPackage
	);
router
	.route('/:vip_package_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_VIP_PACKAGE]),
		UpdateVipPackageValidation,
		updateVipPackage
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_VIP_PACKAGE]),
		AddVipPackageValidation,
		addVipPackage
	);
router
	.route('/:vip_package_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_VIP_PACKAGE]),
		DeleteVipPackageValidation,
		deleteVipPackage
	);

export default router;
