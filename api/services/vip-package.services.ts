import { VipPackage } from '../models/vip-package.models';

export const getVipPackages = async () => {
	return await VipPackage.find();
};

export const getVipPackage = async (serial: number) => {
	return await VipPackage.findOne({
		where: {
			serial,
		},
	});
};

export const updateVipPackage = async (serial: number, amount: number) => {
	const vipPackage = VipPackage.create({
		amount,
	});

	return await VipPackage.update(
		{
			serial,
		},
		vipPackage
	);
};

export const createVipPackage = async (serial: number, amount: number) => {
	const vipPackage = VipPackage.create({
		serial,
		amount,
	});

	return await vipPackage.save();
};

export const deleteVipPackage = async (serial: number) => {
	return await VipPackage.delete({ serial });
};
