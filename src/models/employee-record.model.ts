import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	DeleteDateColumn,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
	BeforeUpdate,
	BeforeInsert,
	Check,
} from 'typeorm';

import { AcupunctureReport } from './acupuncture-report.models';
import { Employee } from './employee.models';
import { Gender, Role } from './enums';
import { Payroll } from './payroll.models';
import { Schedule } from './schedule.models';

import { DataStructureError } from '../exceptions/data-structure.error';

@Check(`EXTRACT(DAY FROM valid_from) = 1`)
@Check(`valid_to IS NULL OR EXTRACT(DAY FROM valid_to) = 1`)
@Entity('employee_history')
export class EmployeeRecord extends BaseEntity {
	@ManyToOne(() => Employee, (employee) => employee.records, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({
		name: 'employee_id',
	})
	employee: Employee;

	@PrimaryColumn()
	employee_id: number;

	// valid_from is inclusive and valid_to is non-inclusive,
	// e.g. valid_from = '2024-10-12' and valid_to = '2024-10-14', then record is only valid on '2024-10-12' and '2024-10-13
	@PrimaryColumn({
		type: 'date',
	})
	valid_from: string;

	@Column({
		type: 'date',
		nullable: true,
	})
	valid_to: string | null;

	@Column({
		length: 30,
	})
	username: string;

	@Column({
		length: 30,
	})
	first_name: string;

	@Column({
		length: 30,
	})
	last_name: string;

	@Column({
		type: 'enum',
		enum: Gender,
	})
	gender: Gender;

	@Column({
		type: 'enum',
		enum: Role,
	})
	role: Role;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		nullable: true,
		transformer: {
			to(bodyRate: number | null) {
				return bodyRate;
			},
			from(bodyRate: string | null) {
				return bodyRate === null ? null : Number(bodyRate);
			},
		},
	})
	body_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		nullable: true,
		transformer: {
			to(feetRate: number | null) {
				return feetRate;
			},
			from(feetRate: string | null) {
				return feetRate === null ? null : Number(feetRate);
			},
		},
	})
	feet_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		nullable: true,
		transformer: {
			to(acupunctureRate: number | null) {
				return acupunctureRate;
			},
			from(acupunctureRate: string | null) {
				return acupunctureRate === null ? null : Number(acupunctureRate);
			},
		},
	})
	acupuncture_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		nullable: true,
		transformer: {
			to(perHour: number | null) {
				return perHour;
			},
			from(perHour: string | null) {
				return perHour === null ? null : Number(perHour);
			},
		},
	})
	per_hour: number | null;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(() => Schedule, (schedule) => schedule.employee)
	schedules: Schedule[];

	@OneToMany(() => Payroll, (payroll) => payroll.employee)
	payrolls: Payroll[];

	@OneToMany(
		() => AcupunctureReport,
		(acupunctureReport) => acupunctureReport.employee
	)
	acupuncture_reports: AcupunctureReport[];

	@BeforeInsert()
	async beforeInsert() {
		this.checkValidDates();
		this.ensureEmployeeExists();
	}

	@BeforeUpdate()
	async beforeUpdate() {
		this.checkValidDates();
	}

	private async checkValidDates() {
		const { valid_from, valid_to } = this;

		if (valid_to !== null && valid_from >= valid_to) {
			throw new DataStructureError(
				'Employee',
				"'valid from' must be before 'valid to'."
			);
		}
	}

	async ensureEmployeeExists() {
		const { employee_id } = this;

		const employee = await Employee.findOne({
			where: {
				employee_id,
			},
		});

		if (!employee) {
			throw new DataStructureError(
				'Employee',
				'Record must be for existing employee.'
			);
		} else {
			this.username = employee.username;
			this.first_name = employee.first_name;
			this.last_name = employee.last_name;
			this.gender = employee.gender;
			this.role = employee.role;
		}
	}
}
