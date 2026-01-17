import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import {
	AcupunctureReport,
	AcupunctureReportDataRow,
} from '../models/acupuncture-report.models';
import { Reservation } from '../models/reservation.models';

// Groups reservations by day
const groupReservationsByDate = (
	reservations: Reservation[]
): Map<number, Reservation[]> => {
	const reservationMap = new Map<number, Reservation[]>();

	reservations.forEach((reservation) => {
		const day = reservation.day;
		if (!reservationMap.has(day)) {
			reservationMap.set(day, []);
		}
		reservationMap.get(day)!.push(reservation);
	});

	return reservationMap;
};

// Computes report data from pre-fetched reservations (no additional queries)
export const computeAcupunctureReportData = (
	report: AcupunctureReport,
	reservations: Reservation[]
): void => {
	const { year, month, employee_id } = report;

	// Filter reservations for this report's year/month
	const reportReservations = reservations.filter(
		(r) => r.year === year && r.month === month
	);

	const reservationsByDate = groupReservationsByDate(reportReservations);

	report.data = [];

	reservationsByDate.forEach((dayReservations) => {
		const date = dayReservations[0].date;

		const validReservations = dayReservations.filter(
			(reservation) => reservation.service !== null
		);

		const acupunctureReservations = validReservations.filter(
			(reservation) => reservation.service.acupuncture > 0
		);

		const acupuncturistReservations: Reservation[] = [];
		const nonAcupuncturistReservations: Reservation[] = [];

		acupunctureReservations.forEach((reservation) => {
			if (reservation.employee_id === employee_id) {
				acupuncturistReservations.push(reservation);
			} else {
				nonAcupuncturistReservations.push(reservation);
			}
		});

		const acupuncture = acupuncturistReservations
			.flatMap((reservation) => [
				reservation.cash ?? 0,
				reservation.machine ?? 0,
				reservation.vip ?? 0,
				reservation.gift_card ?? 0,
			])
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const massage = nonAcupuncturistReservations
			.flatMap((reservation) => [
				reservation.cash ?? 0,
				reservation.machine ?? 0,
				reservation.vip ?? 0,
				reservation.gift_card ?? 0,
			])
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const insurance = acupuncturistReservations
			.map((reservation) => reservation.insurance ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const nonAcupuncturistInsurance = nonAcupuncturistReservations
			.map((reservation) => reservation.insurance ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const dataRow: AcupunctureReportDataRow = {
			date,
			acupuncture,
			massage,
			insurance,
			non_acupuncturist_insurance: nonAcupuncturistInsurance,
		};

		report.data.push(dataRow);
	});
};

export const getAcupunctureReports = async (
	start?: { year: number; month: number },
	end?: { year: number; month: number },
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<AcupunctureReport> = {};

	if (start && end) {
		whereCondition.year = Between(start.year, end.year);
		whereCondition.month = Between(start.month, end.month);
	} else if (start) {
		whereCondition.year = MoreThanOrEqual(start.year);
		whereCondition.month = MoreThanOrEqual(start.month);
	} else if (end) {
		whereCondition.year = LessThanOrEqual(end.year);
		whereCondition.month = LessThanOrEqual(end.month);
	}

	if (employeeIds) {
		whereCondition.employee_id = In(employeeIds);
	}

	const reports = await AcupunctureReport.find({
		where: whereCondition,
		order: {
			year: 'ASC',
			month: 'ASC',
			employee_id: 'ASC',
		},
	});

	if (reports.length === 0) {
		return reports;
	}

	// Batch fetch all reservations for all year/month combinations
	const reservationWhereConditions = [
		...new Map(
			reports.map((r) => [`${r.year}-${r.month}`, { year: r.year, month: r.month }])
		).values(),
	];

	const reservations = await Reservation.find({
		where: reservationWhereConditions,
		order: { day: 'ASC' },
		withDeleted: true,
	});

	// Compute data for each report
	for (const report of reports) {
		computeAcupunctureReportData(report, reservations);
	}

	return reports;
};

export const getAcupunctureReport = async (
	year: number,
	month: number,
	employeeId: number
) => {
	const report = await AcupunctureReport.findOne({
		where: {
			year,
			month,
			employee_id: employeeId,
		},
	});

	if (report) {
		const reservations = await Reservation.find({
			where: { year, month },
			order: { day: 'ASC' },
			withDeleted: true,
		});
		computeAcupunctureReportData(report, reservations);
	}

	return report;
};

export const updateAcupunctureReport = async (
	year: number,
	month: number,
	employeeId: number,
	acupuncturePercentage?: number,
	massagePercentage?: number,
	insurancePercentage?: number,
	nonAcupuncturistInsurancePercentage?: number
) => {
	const acupunctureReport = await getAcupunctureReport(year, month, employeeId);

	if (acupunctureReport) {
		const updates: Partial<AcupunctureReport> = {};

		if (acupuncturePercentage !== undefined) {
			updates.acupuncture_percentage = acupuncturePercentage;
		}

		if (massagePercentage !== undefined) {
			updates.massage_percentage = massagePercentage;
		}

		if (insurancePercentage !== undefined) {
			updates.insurance_percentage = insurancePercentage;
		}

		if (nonAcupuncturistInsurancePercentage !== undefined) {
			updates.non_acupuncturist_insurance_percentage =
				nonAcupuncturistInsurancePercentage;
		}

		Object.assign(acupunctureReport, updates);

		return acupunctureReport.save();
	} else {
		return null;
	}
};

export const createAcupunctureReport = async (
	year: number,
	month: number,
	employeeId: number,
	acupuncturePercentage: number,
	massagePercentage: number,
	insurancePercentage: number,
	nonAcupuncturistInsurancePercentage: number
) => {
	const acupunctureReport = AcupunctureReport.create({
		year,
		month,
		employee_id: employeeId,
		acupuncture_percentage: acupuncturePercentage,
		massage_percentage: massagePercentage,
		insurance_percentage: insurancePercentage,
		non_acupuncturist_insurance_percentage: nonAcupuncturistInsurancePercentage,
	});

	return acupunctureReport.save();
};

export const deleteAcupunctureReport = async (
	year: number,
	month: number,
	employeeId: number
) => {
	const acupunctureReport = await getAcupunctureReport(year, month, employeeId);

	if (acupunctureReport) {
		return acupunctureReport.remove();
	} else {
		return null;
	}
};
