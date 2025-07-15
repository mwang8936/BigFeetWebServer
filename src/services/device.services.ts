import { FindOptionsWhere, In, IsNull, Not } from 'typeorm';

import { Device } from '../models/device.models';

export const getDevices = async (
	employeeIds?: number[],
	hasPushToken: boolean = false
) => {
	const whereCondition: FindOptionsWhere<Device> = {};

	if (employeeIds) {
		whereCondition.employee_id = In(employeeIds);
	}

	if (hasPushToken) {
		whereCondition.push_token = Not(IsNull());
	}

	return Device.find({
		where: whereCondition,
		order: {
			employee_id: 'ASC',
			device_name: 'ASC',
		},
	});
};

export const getDevice = async (deviceId: string, employeeId: number) => {
	return Device.findOne({
		where: {
			device_id: deviceId,
			employee_id: employeeId,
		},
	});
};

export const upsertDevice = async (
	deviceId: string,
	employeeId: number,
	deviceName?: string,
	deviceModel?: string,
	pushToken?: string,
	refreshToken?: string
) => {
	const device = Device.create({
		device_id: deviceId,
		employee_id: employeeId,
		device_name: deviceName,
		device_model: deviceModel,
		push_token: pushToken,
		refresh_token: refreshToken,
	});

	return device.save();
};

export const unregisterDevice = async (
	deviceId: string,
	employeeId: number
) => {
	const device = await getDevice(deviceId, employeeId);

	if (device) {
		return device.remove();
	} else {
		return null;
	}
};
