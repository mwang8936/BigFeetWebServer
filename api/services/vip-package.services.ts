import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';

export const getVipPackages = async () => {
	return await VipPackage.find();
};

export const getVipPackage = async (serial: string) => {
	return await VipPackage.findOne({
		where: {
			serial,
		},
	});
};

export const updateVipPackage = async (
	serial: string,
	amount?: number,
	schedules?: { date: Date; employee_id: number }[]
) => {
	const vipPackage = VipPackage.create({
		amount,
		schedules,
	});

	return await VipPackage.update(
		{
			serial,
		},
		vipPackage
	);
};

export const createVipPackage = async (
	serial: string,
	amount: number,
	schedules: { date: Date; employee_id: number }[]
) => {
	const vipPackage = VipPackage.create({
		serial,
		amount,
		//schedules,
	});

	const mySchedules = schedules.map((schedule) =>
		Schedule.create({ employee_id: schedule.employee_id, date: schedule.date })
	);
	vipPackage.schedules = mySchedules;
	return await vipPackage.save();
};

export const deleteVipPackage = async (serial: string) => {
	return await VipPackage.delete({ serial });
};
