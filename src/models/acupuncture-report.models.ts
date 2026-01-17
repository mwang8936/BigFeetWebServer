import {
	Entity,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
	Column,
	Check,
} from 'typeorm';

import { Employee } from './employee.models';

export interface AcupunctureReportDataRow {
	date: string;
	acupuncture: number;
	massage: number;
	insurance: number;
	non_acupuncturist_insurance: number;
}

@Check(`"year" >= 2020`)
@Check(`"month" >= 1 AND month <= 12`)
@Entity('acupuncture_report')
export class AcupunctureReport extends BaseEntity {
	@PrimaryColumn()
	year: number;

	@PrimaryColumn()
	month: number;

	@PrimaryColumn()
	employee_id: number;

	@ManyToOne(() => Employee, (employee) => employee.acupuncture_reports, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'employee_id',
	})
	employee: Employee;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.7,
		transformer: {
			to(acupuncture_percentage: number) {
				return acupuncture_percentage;
			},
			from(acupuncture_percentage: string) {
				return Number(acupuncture_percentage);
			},
		},
	})
	acupuncture_percentage: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.3,
		transformer: {
			to(massage_percentage: number) {
				return massage_percentage;
			},
			from(massage_percentage: string) {
				return Number(massage_percentage);
			},
		},
	})
	massage_percentage: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.3,
		transformer: {
			to(insurance_percentage: number) {
				return insurance_percentage;
			},
			from(insurance_percentage: string) {
				return Number(insurance_percentage);
			},
		},
	})
	insurance_percentage: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.7,
		transformer: {
			to(non_acupunturist_insurance_percentage: number) {
				return non_acupunturist_insurance_percentage;
			},
			from(non_acupunturist_insurance_percentage: string) {
				return Number(non_acupunturist_insurance_percentage);
			},
		},
	})
	non_acupuncturist_insurance_percentage: number;

	data: AcupunctureReportDataRow[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

}
