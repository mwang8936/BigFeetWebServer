import { Service } from '../models/service.models';
import { ServiceColor } from '../models/enums';
import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { Not } from 'typeorm';

export const getServices = async (withDeleted?: boolean) => {
	return Service.find({
		withDeleted,
	});
};

export const getService = async (serviceId: number, withDeleted?: boolean) => {
	return Service.findOne({
		where: {
			service_id: serviceId,
		},
		withDeleted,
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
	bedsRequired?: number,
	color?: ServiceColor
) => {
	const service = await getService(serviceId);

	if (service) {
		const updates: Partial<Service> = {};

		if (serviceName !== undefined) {
			await duplicateServiceNameChecker(serviceName, serviceId);
			updates.service_name = serviceName;
		}

		if (shorthand !== undefined) {
			await duplicateShorthandChecker(shorthand, serviceId);
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

		if (bedsRequired !== undefined) {
			updates.beds_required = bedsRequired;
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
	bedsRequired: number,
	color: ServiceColor,
	body?: number,
	feet?: number,
	acupuncture?: number
) => {
	await duplicateServiceNameChecker(serviceName);
	await duplicateShorthandChecker(shorthand);

	const service = Service.create({
		service_name: serviceName,
		shorthand: shorthand,
		time: time,
		money: money,
		body: body,
		feet: feet,
		acupuncture: acupuncture,
		beds_required: bedsRequired,
		color: color,
	});

	return service.save();
};

export const deleteService = async (serviceId: number) => {
	const service = await getService(serviceId, false);

	if (service) {
		return service.softRemove();
	} else {
		return null;
	}
};

export const recoverService = async (serviceId: number) => {
	const service = await getService(serviceId, true);

	if (service) {
		await duplicateServiceNameChecker(service.service_name);
		await duplicateShorthandChecker(service.shorthand);

		return service.recover();
	} else {
		return null;
	}
};

const duplicateServiceNameChecker = async (
	serviceName: string,
	serviceId?: number
) => {
	const duplicates = await Service.find({
		where: {
			service_id: serviceId && Not(serviceId),
			service_name: serviceName,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Service', 'Service Name', serviceName);
	}
};

const duplicateShorthandChecker = async (
	shorthand: string,
	serviceId?: number
) => {
	const duplicates = await Service.find({
		where: {
			service_id: serviceId && Not(serviceId),
			shorthand,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Service', 'Shorthand', shorthand);
	}
};
