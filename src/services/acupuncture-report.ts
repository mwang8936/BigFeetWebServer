import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { AcupunctureReport } from '../models/acupuncture-report.models';

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

	return AcupunctureReport.find({
		where: whereCondition,
		order: {
			year: 'ASC',
			month: 'ASC',
			employee_id: 'ASC',
		},
	});
};

export const getAcupunctureReport = async (
	year: number,
	month: number,
	employeeId: number
) => {
	return AcupunctureReport.findOne({
		where: {
			year,
			month,
			employee_id: employeeId,
		},
	});
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
