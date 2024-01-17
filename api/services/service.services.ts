import { Service } from '../models/service.models';
import { ServiceColor } from '../models/enums';

export const getServices = async () => {
	return await Service.find({
		where: {
			is_active: true,
		},
	});
};

export const getService = async (serviceId: number) => {
	return await Service.findOne({
		where: {
			service_id: serviceId,
			is_active: true,
		},
	});
};

export const updateService = async (
	serviceId: number,
	serviceName?: string,
	shorthand?: string,
	time?: number,
	money?: number,
	body?: number,
	feet?: number,
	accupuncture?: number,
	color?: ServiceColor
) => {
	const service = Service.create({
		service_id: serviceId,
		service_name: serviceName,
		shorthand: shorthand,
		time: time,
		money: money,
		body: body,
		feet: feet,
		accupuncture: accupuncture,
		color: color,
	});

	return await Service.update(
		{
			service_id: serviceId,
			is_active: true,
		},
		service
	);
};

export const createService = async (
	serviceName: string,
	shorthand: string,
	time: number,
	money: number,
	color: ServiceColor,
	body?: number,
	feet?: number,
	accupuncture?: number
) => {
	const service = Service.create({
		service_name: serviceName,
		shorthand: shorthand,
		time: time,
		money: money,
		body: body,
		feet: feet,
		accupuncture: accupuncture,
		color: color,
	});

	return await service.save();
};

export const deleteService = async (serviceId: number) => {
	return await Service.update(
		{
			service_id: serviceId,
			is_active: true,
		},
		{
			is_active: false,
		}
	);
};
