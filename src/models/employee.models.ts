import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
	DeleteDateColumn,
} from 'typeorm';

import { AcupunctureReport } from './acupuncture-report.models';
import { Gender, Language, Permissions, Role } from './enums';
import { Schedule } from './schedule.models';
import { Payroll } from './payroll.models';
import { Device } from './device.models';

@Entity('employees')
export class Employee extends BaseEntity {
	@PrimaryGeneratedColumn()
	employee_id: number;

	@Column({
		length: 30,
	})
	username: string;

	@Column({
		select: false,
		length: 60,
	})
	password: string;

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
		type: 'enum',
		enum: Permissions,
		array: true,
		default: [],
	})
	permissions: Permissions[];

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

	@Column({
		type: 'enum',
		enum: Language,
		default: Language.ENGLISH,
	})
	language: Language;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(() => Device, (device) => device.employee)
	devices: Device[];

	@OneToMany(() => Schedule, (schedule) => schedule.employee)
	schedules: Schedule[];

	@OneToMany(() => Payroll, (payroll) => payroll.employee)
	payrolls: Payroll[];

	@OneToMany(
		() => AcupunctureReport,
		(acupunctureReport) => acupunctureReport.employee
	)
	acupuncture_reports: AcupunctureReport[];
}
