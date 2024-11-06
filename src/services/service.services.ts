import { ServiceColor } from '../models/enums';
import { Reservation } from '../models/reservation.models';
import { Service } from '../models/service.models';
import { ServiceRecord } from '../models/service-record.models';

import { formatDate, getNextDate } from '../utils/date.utils';

export const getServices = async (
	withDeleted: boolean = false,
	loadEagerRelations: boolean = false
): Promise<Service[]> => {
	return Service.find({
		withDeleted,
		loadEagerRelations,
		order: {
			service_name: 'ASC',
		},
	});
};

export const getService = async (
	serviceId: number,
	withDeleted: boolean = false,
	loadEagerRelations: boolean = false
): Promise<Service | null> => {
	return Service.findOne({
		where: {
			service_id: serviceId,
		},
		withDeleted,
		loadEagerRelations,
	});
};

export const updateService = async (
	serviceId: number,
	serviceName?: string,
	shorthand?: string,
	color?: ServiceColor
): Promise<Service | null> => {
	const service = await getService(serviceId);

	if (service) {
		const updates: Partial<Service> = {};

		if (serviceName !== undefined) {
			updates.service_name = serviceName;
		}

		if (shorthand !== undefined) {
			updates.shorthand = shorthand;
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
	date: string,
	serviceName: string,
	shorthand: string,
	time: number,
	money: number,
	bedsRequired: number,
	color: ServiceColor,
	body?: number,
	feet?: number,
	acupuncture?: number
): Promise<Service> => {
	const service = Service.create({
		service_name: serviceName,
		shorthand: shorthand,
		color: color,
	});

	service.valid_from = date;
	service.time = time;
	service.money = money;
	service.body = body ?? 0;
	service.feet = feet ?? 0;
	service.acupuncture = acupuncture ?? 0;
	service.beds_required = bedsRequired;

	return service.save();
};

const findLastRecord = async (
	serviceId: number
): Promise<ServiceRecord | null> => {
	return ServiceRecord.findOne({
		where: {
			service_id: serviceId,
		},
		order: {
			valid_from: 'DESC',
		},
	});
};

const findLastReservation = async (
	serviceRecord: ServiceRecord
): Promise<Reservation | null> => {
	return Reservation.findOne({
		where: {
			service: {
				service_id: serviceRecord.service_id,
				valid_from: serviceRecord.valid_from,
			},
		},
		order: {
			year: 'DESC',
			month: 'DESC',
			day: 'DESC',
		},
	});
};

const discontinueLastServiceRecord = async (
	serviceId: number
): Promise<ServiceRecord | null> => {
	const lastRecord = await findLastRecord(serviceId);

	if (lastRecord) {
		if (lastRecord.valid_to != undefined) return lastRecord;

		let validTo = getNextDate(lastRecord.valid_from);

		const lastReservation = await findLastReservation(lastRecord);

		if (lastReservation) {
			const lastReservationDate = formatDate(
				lastReservation.year,
				lastReservation.month,
				lastReservation.day
			);

			validTo = getNextDate(lastReservationDate);
		}

		lastRecord.valid_to = validTo;

		return lastRecord.save();
	} else {
		return null;
	}
};

export const deleteService = async (
	serviceId: number,
	discontinueService: boolean = false
): Promise<Service | null> => {
	const service = await getService(serviceId, false);

	if (service) {
		if (discontinueService) await discontinueLastServiceRecord(serviceId);

		return service.softRemove();
	} else {
		return null;
	}
};

const continueLastServiceRecord = async (
	serviceId: number
): Promise<ServiceRecord | null> => {
	const lastRecord = await findLastRecord(serviceId);

	if (lastRecord) {
		lastRecord.valid_to = null;

		return lastRecord.save();
	} else {
		return null;
	}
};

export const recoverService = async (
	serviceId: number,
	continueService: boolean = false
): Promise<Service | null> => {
	const service = await getService(serviceId, true);

	if (service) {
		if (continueService) await continueLastServiceRecord(serviceId);

		return service.recover();
	} else {
		return null;
	}
};
