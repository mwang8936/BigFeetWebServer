import { Service } from '../models/service.models';
import { ServiceColor } from '../models/enums';

export const getServices = async () => {
	return Service.find({
		where: {
			is_active: true,
		},
	});
};

export const getService = async (serviceId: number) => {
	return Service.findOne({
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
	acupuncture?: number,
	bedRequired?: boolean,
	color?: ServiceColor
) => {
	const service = await getService(serviceId);

	if (service) {
		const updates: Partial<Service> = {};

		if (serviceName !== undefined) {
			updates.service_name = serviceName;
		}

		if (shorthand !== undefined) {
			updates.shorthand = shorthand;
		}

		if (time !== undefined) {
			updates.time = time;
		}

		if (money !== undefined) {
			updates.money = money;
		}

		if (body !== undefined) {
			updates.body = body;
		}

		if (feet !== undefined) {
			updates.feet = feet;
		}

		if (acupuncture !== undefined) {
			updates.acupuncture = acupuncture;
		}

		if (bedRequired !== undefined) {
			updates.bed_required = bedRequired;
		}

		if (color !== undefined) {
			updates.color = color;
		}

		Object.assign(service, updates);

		return service.save();
	} else {
		return null;
	}
};

export const createService = async (
	serviceName: string,
	shorthand: string,
	time: number,
	money: number,
	bedRequired: boolean,
	color: ServiceColor,
	body?: number,
	feet?: number,
	acupuncture?: number
) => {
	const service = Service.create({
		service_name: serviceName,
		shorthand: shorthand,
		time: time,
		money: money,
		body: body,
		feet: feet,
		acupuncture: acupuncture,
		bed_required: bedRequired,
		color: color,
	});

	return service.save();
};

export const deleteService = async (serviceId: number) => {
	const service = await getService(serviceId);

	if (service) {
		return service.remove();
	} else {
		return null;
	}
};
