import AppDataSource from '../config/orm.config';

import { AcupunctureReport } from '../models/acupuncture-report.models';

export const getAcupunctureReports = async (
	start?: { year: number; month: number },
	end?: { year: number; month: number },
	employeeIds?: number[]
) => {
	const acupunctureReportsRepository =
		AppDataSource.getRepository(AcupunctureReport);

	const queryBuilder =
		acupunctureReportsRepository.createQueryBuilder('acupuncture_report');

	if (start) {
		queryBuilder.andWhere(
			`MAKE_DATE(acupuncture_report.year, acupuncture_report.month, 1) >= MAKE_DATE(:startYear, :startMonth, 1)`,
			{ startYear: start.year, startMonth: start.month }
		);
	}

	if (end) {
		queryBuilder.andWhere(
			`MAKE_DATE(acupuncture_report.year, acupuncture_report.month, 1) <= MAKE_DATE(:endYear, :endMonth, 1)`,
			{ endYear: end.year, endMonth: end.month }
		);
	}

	if (employeeIds) {
		queryBuilder.andWhere(
			'acupuncture_report.employee_id IN (:...employeeIds)',
			{ employeeIds }
		);
	}

	queryBuilder
		.orderBy('acupuncture_report.year', 'ASC')
		.addOrderBy('acupuncture_report.month', 'ASC')
		.addOrderBy('acupuncture_report.employee_id', 'ASC');

	queryBuilder.setFindOptions({ loadEagerRelations: true });

	return queryBuilder.getMany();
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
