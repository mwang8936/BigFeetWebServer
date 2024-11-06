import { Brackets, FindOptionsWhere, In, LessThan, MoreThan } from 'typeorm';

import AppDataSource from '../config/orm.config';

import { ConflictingRecordsError } from '../exceptions/conflicting-date-error';
import { ConflictingReservationError } from '../exceptions/conflicting-reservation-error';
import { NotFoundError } from '../exceptions/not-found-error';
import { RecordAlreadyDiscontinuedError } from '../exceptions/record-already-discontinued-error';

import { Reservation } from '../models/reservation.models';
import { Service } from '../models/service.models';
import { ServiceRecord } from '../models/service-record.models';

import {
	convertYYYYMMDDToYearMonthDayObject,
	formatDate,
} from '../utils/date.utils';

export const getServiceRecordsByDate = async (
	date: string
): Promise<ServiceRecord[]> => {
	const serviceRecordsRepository = AppDataSource.getRepository(ServiceRecord);

	return serviceRecordsRepository
		.createQueryBuilder('service_history')
		.where('service_history.valid_from <= :date', { date })
		.andWhere(
			new Brackets((qb) => {
				qb.where('service_history.valid_to IS NULL').orWhere(
					'service_history.valid_to > :date',
					{ date }
				);
			})
		)
		.distinctOn(['service_history.service_id'])
		.getMany();
};

const sameServices = (
	service1: ServiceRecord,
	service2: ServiceRecord
): boolean => {
	const compareFields = (field1: any, field2: any): boolean => {
		// If either field is undefined, treat as the same
		if (field1 === undefined || field2 === undefined) {
			return true;
		}

		// If both fields are null, treat as the same
		if (field1 === null && field2 === null) {
			return true;
		}

		// If both fields are strictly equal (and not null/undefined), treat as the same
		return field1 === field2;
	};

	return (
		compareFields(service1.time, service2.time) &&
		compareFields(service1.money, service2.money) &&
		compareFields(service1.body, service2.body) &&
		compareFields(service1.feet, service2.feet) &&
		compareFields(service1.acupuncture, service2.acupuncture) &&
		compareFields(service1.beds_required, service2.beds_required)
	);
};

const findPreviousServiceRecord = async (
	serviceId: number,
	date: string
): Promise<ServiceRecord | null> => {
	return ServiceRecord.findOne({
		where: {
			service_id: serviceId,
			valid_from: LessThan(date),
		},
		order: {
			valid_from: 'DESC',
		},
	});
};

const findCurrentServiceRecord = async (
	serviceId: number,
	date: string
): Promise<ServiceRecord | null> => {
	return ServiceRecord.findOne({
		where: {
			service_id: serviceId,
			valid_from: date,
		},
	});
};

const findNextServiceRecord = async (
	serviceId: number,
	date: string
): Promise<ServiceRecord | null> => {
	return ServiceRecord.findOne({
		where: {
			service_id: serviceId,
			valid_from: MoreThan(date),
		},
		order: {
			valid_from: 'ASC',
		},
	});
};

const findLastServiceRecord = async (
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

const findReservations = async (
	serviceId: number,
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number }
): Promise<Reservation[]> => {
	const reservationsRepository = AppDataSource.getRepository(Reservation);

	const queryBuilder = reservationsRepository
		.createQueryBuilder('reservations')
		.where('reservations.service_id = :serviceId', { serviceId });

	if (start) {
		queryBuilder.andWhere(
			`MAKE_DATE(reservations.year, reservations.month, reservations.day) >= MAKE_DATE(:startYear, :startMonth, :startDay)`,
			{ startYear: start.year, startMonth: start.month, startDay: start.day }
		);
	}

	if (end) {
		queryBuilder.andWhere(
			`MAKE_DATE(reservations.year, reservations.month, reservations.day) < MAKE_DATE(:endYear, :endMonth, :endDay)`,
			{ endYear: end.year, endMonth: end.month, endDay: end.day }
		);
	}

	return queryBuilder
		.orderBy('reservations.year', 'ASC')
		.addOrderBy('reservations.month', 'ASC')
		.addOrderBy('reservations.day', 'ASC')
		.getMany();
};

const updateServiceRecord = async (
	currentServiceRecord: ServiceRecord,
	time?: number,
	money?: number,
	body?: number,
	feet?: number,
	acupuncture?: number,
	bedsRequired?: number
): Promise<ServiceRecord | null> => {
	const serviceId = currentServiceRecord.service_id;
	const validFrom = currentServiceRecord.valid_from;

	const updatedServiceRecord = ServiceRecord.create({
		service_id: currentServiceRecord.service_id,
		valid_from: currentServiceRecord.valid_from,
		valid_to: currentServiceRecord.valid_to,
		service_name: currentServiceRecord.service_name,
		shorthand: currentServiceRecord.shorthand,
		time,
		money,
		body,
		feet,
		acupuncture,
		beds_required: bedsRequired,
		color: currentServiceRecord.color,
	});

	if (sameServices(currentServiceRecord, updatedServiceRecord)) return null;

	// Check to see if there was a previous service record before the given date
	const prevServiceRecord = await findPreviousServiceRecord(
		serviceId,
		validFrom
	);

	const nextServiceRecord = await findNextServiceRecord(serviceId, validFrom);

	if (
		prevServiceRecord &&
		sameServices(prevServiceRecord, updatedServiceRecord)
	) {
		// If previous service is the same as the updated service record,
		// then extend previous service record's valid to and remove current service record.

		// If next service record is also equal to updated service record, then also delete next service record,
		// and extend previous service record's valid to to the end of next service record's valid to.
		if (
			nextServiceRecord &&
			sameServices(updatedServiceRecord, nextServiceRecord)
		) {
			prevServiceRecord.valid_to = nextServiceRecord.valid_to;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.update(
					Reservation,
					{ service: currentServiceRecord },
					{ service: prevServiceRecord }
				);
				await transactionalEntityManager.update(
					Reservation,
					{ service: nextServiceRecord },
					{ service: prevServiceRecord }
				);

				await transactionalEntityManager.save(prevServiceRecord);
				await transactionalEntityManager.remove(currentServiceRecord);
				await transactionalEntityManager.remove(nextServiceRecord);
			});

			return prevServiceRecord;
		} else {
			prevServiceRecord.valid_to = currentServiceRecord.valid_to;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.update(
					Reservation,
					{ service: currentServiceRecord },
					{ service: prevServiceRecord }
				);

				await transactionalEntityManager.save(prevServiceRecord);
				await transactionalEntityManager.remove(currentServiceRecord);
			});
		}

		return prevServiceRecord;
	} else {
		if (
			nextServiceRecord &&
			sameServices(updatedServiceRecord, nextServiceRecord)
		) {
			// If next service record is the same as the udpated service record, then delete the next service record
			// and extend the current service record's valid to to the end of next service record's valid to.
			updatedServiceRecord.valid_to = nextServiceRecord.valid_to;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.update(
					Reservation,
					{ service: nextServiceRecord },
					{ service: updatedServiceRecord }
				);

				await transactionalEntityManager.save(updatedServiceRecord);
				await transactionalEntityManager.remove(nextServiceRecord);
			});

			return updatedServiceRecord;
		} else {
			// If previous service record/next service record do not exist, or are not the same,
			// then just update the fields of the current service record.
			const updates: Partial<ServiceRecord> = {};

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

			Object.assign(currentServiceRecord, updates);

			return currentServiceRecord.save();
		}
	}
};

export const addServiceRecord = async (
	serviceId: number,
	date: string,
	time: number,
	money: number,
	bedsRequired: number,
	body?: number,
	feet?: number,
	acupuncture?: number
): Promise<ServiceRecord | null> => {
	const currentServiceRecord = await findCurrentServiceRecord(serviceId, date);

	const lastServiceRecord = await findLastServiceRecord(serviceId);

	if (lastServiceRecord?.valid_to && lastServiceRecord.valid_to <= date)
		throw new RecordAlreadyDiscontinuedError(
			'Service',
			serviceId,
			lastServiceRecord.valid_to
		);

	// If a record already exists with the same service id and date, you should be using the update record API call.
	if (currentServiceRecord)
		return updateServiceRecord(
			currentServiceRecord,
			time,
			money,
			body,
			feet,
			acupuncture,
			bedsRequired
		);

	const service = await Service.findOne({
		where: {
			service_id: serviceId,
		},
	});

	if (!service) throw new NotFoundError('Service', 'service id', serviceId);

	const newServiceRecord = ServiceRecord.create({
		service_id: serviceId,
		valid_from: date,
		service_name: service.service_name,
		shorthand: service.shorthand,
		time,
		money,
		body,
		feet,
		acupuncture,
		beds_required: bedsRequired,
		color: service.color,
	});

	// Check to see if there was a previous service record before the given date
	const prevServiceRecord = await findPreviousServiceRecord(serviceId, date);
	const nextServiceRecord = await findNextServiceRecord(serviceId, date);

	if (prevServiceRecord) {
		// If previous service is the same as the new service record, then no need to add a new record.
		if (sameServices(prevServiceRecord, newServiceRecord)) return null;

		if (
			nextServiceRecord &&
			sameServices(newServiceRecord, nextServiceRecord)
		) {
			// If our next service record is the same as our new service record,
			// just extend our next service record's valid from date to the specified date.
			nextServiceRecord.valid_from = date;
			prevServiceRecord.valid_to = date;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.save(prevServiceRecord);
				await transactionalEntityManager.save(nextServiceRecord);

				// Find all reservations that used prevServiceRecord and needs to be updated.
				const whereCondition: FindOptionsWhere<Reservation> = {
					service: prevServiceRecord,
				};

				if (nextServiceRecord.valid_to === null) {
					const reservations = await findReservations(
						serviceId,
						convertYYYYMMDDToYearMonthDayObject(nextServiceRecord.valid_from)
					);

					whereCondition.reservation_id = In(
						reservations.map((reservation) => reservation.reservation_id)
					);
				} else {
					const reservations = await findReservations(
						serviceId,
						convertYYYYMMDDToYearMonthDayObject(nextServiceRecord.valid_from),
						convertYYYYMMDDToYearMonthDayObject(nextServiceRecord.valid_to)
					);

					whereCondition.reservation_id = In(
						reservations.map((reservation) => reservation.reservation_id)
					);
				}

				await transactionalEntityManager.update(Reservation, whereCondition, {
					service: nextServiceRecord,
				});
			});

			return nextServiceRecord;
		} else {
			// Our new service record is valid to the previous service record's valid to or null if it did not exist.
			newServiceRecord.valid_to = prevServiceRecord.valid_to;
			prevServiceRecord.valid_to = date;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.save(prevServiceRecord);
				await transactionalEntityManager.save(newServiceRecord);

				const whereCondition: FindOptionsWhere<Reservation> = {
					service: prevServiceRecord,
				};

				if (newServiceRecord.valid_to === null) {
					const reservations = await findReservations(
						serviceId,
						convertYYYYMMDDToYearMonthDayObject(newServiceRecord.valid_from)
					);

					whereCondition.reservation_id = In(
						reservations.map((reservation) => reservation.reservation_id)
					);
				} else {
					const reservations = await findReservations(
						serviceId,
						convertYYYYMMDDToYearMonthDayObject(newServiceRecord.valid_from),
						convertYYYYMMDDToYearMonthDayObject(newServiceRecord.valid_to)
					);

					whereCondition.reservation_id = In(
						reservations.map((reservation) => reservation.reservation_id)
					);
				}

				await transactionalEntityManager.update(Reservation, whereCondition, {
					service: newServiceRecord,
				});
			});

			return newServiceRecord;
		}
	} else if (nextServiceRecord) {
		if (sameServices(newServiceRecord, nextServiceRecord)) {
			// If our next service record is the same as our new service record,
			// just extend our next service record's valid from date to the specified date.
			nextServiceRecord.valid_from = date;

			return nextServiceRecord.save();
		} else {
			// Our new service record is valid to the next service record.
			newServiceRecord.valid_to = nextServiceRecord.valid_from;

			return newServiceRecord.save();
		}
	} else {
		// If no previous or next service records exist, then our new service record is valid to indefinitely.
		return newServiceRecord.save();
	}
};

export const continueService = async (
	serviceId: number
): Promise<ServiceRecord | null> => {
	const lastRecord = await findLastServiceRecord(serviceId);

	if (lastRecord) {
		lastRecord.valid_to = null;

		return lastRecord.save();
	} else {
		return null;
	}
};

export const discontinueService = async (
	serviceId: number,
	validTo: string
): Promise<ServiceRecord | null> => {
	const lastRecord = await findLastServiceRecord(serviceId);

	if (lastRecord) {
		if (lastRecord.valid_from >= validTo) {
			throw new ConflictingRecordsError(
				'Service',
				serviceId,
				lastRecord.valid_from
			);
		}

		const { year, month, day } = convertYYYYMMDDToYearMonthDayObject(validTo);

		const activeReservations = await findReservations(serviceId, {
			year,
			month,
			day,
		});

		if (activeReservations.length > 0) {
			const latestReservation =
				activeReservations[activeReservations.length - 1];

			throw new ConflictingReservationError(
				'Service',
				serviceId,
				formatDate(
					latestReservation.year,
					latestReservation.month,
					latestReservation.day
				)
			);
		}

		lastRecord.valid_to = validTo;

		return lastRecord.save();
	} else {
		return null;
	}
};

export const deleteServiceRecord = async (
	serviceId: number,
	validFrom: string
): Promise<ServiceRecord | null> => {
	const serviceRecord = await findCurrentServiceRecord(serviceId, validFrom);

	if (serviceRecord) {
		const prevServiceRecord = await findPreviousServiceRecord(
			serviceId,
			validFrom
		);

		if (prevServiceRecord) {
			const nextServiceRecord = await findNextServiceRecord(
				serviceId,
				validFrom
			);

			if (
				nextServiceRecord &&
				sameServices(prevServiceRecord, nextServiceRecord)
			) {
				// If previous service record exist and is the same as the next service record, delete both
				// the current record and the next record and set valid to to the next record's valid to
				prevServiceRecord.valid_to = nextServiceRecord.valid_to;

				await AppDataSource.transaction(async (transactionalEntityManager) => {
					await transactionalEntityManager.update(
						Reservation,
						{ service: nextServiceRecord },
						{ service: prevServiceRecord }
					);

					await transactionalEntityManager.update(
						Reservation,
						{ service: serviceRecord },
						{ service: prevServiceRecord }
					);

					await transactionalEntityManager.remove(nextServiceRecord);
					await transactionalEntityManager.remove(serviceRecord);
					await transactionalEntityManager.save(prevServiceRecord);
				});

				return serviceRecord;
			} else {
				// If a previous service record exists, remove the current record and set the previous record's valid_to
				// date to the current record's valid_to date.
				prevServiceRecord.valid_to = serviceRecord.valid_to;

				await AppDataSource.transaction(async (transactionalEntityManager) => {
					await transactionalEntityManager.update(
						Reservation,
						{ service: serviceRecord },
						{ service: prevServiceRecord }
					);

					await transactionalEntityManager.remove(serviceRecord);
					await transactionalEntityManager.save(prevServiceRecord);
				});

				return serviceRecord;
			}
		} else {
			// If there is no previous service record, only delete the current record if there are no reservations associated with it.
			const activeReservations = await findReservations(serviceId);

			if (activeReservations.length > 0) {
				const latestReservation =
					activeReservations[activeReservations.length - 1];

				throw new ConflictingReservationError(
					'Service',
					serviceId,
					formatDate(
						latestReservation.year,
						latestReservation.month,
						latestReservation.day
					)
				);
			}

			return serviceRecord.remove();
		}
	} else {
		return null;
	}
};
