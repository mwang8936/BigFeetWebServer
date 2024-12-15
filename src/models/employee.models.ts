import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
	DeleteDateColumn,
	AfterInsert,
	AfterUpdate,
} from 'typeorm';

import { EmployeeRecord } from './employee-record.model';
import { Gender, Language, Permissions, Role } from './enums';

@Entity('employees')
export class Employee extends BaseEntity {
	@PrimaryGeneratedColumn()
	employee_id: number;

	valid_from: string;

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

	body_rate: number | null;
	feet_rate: number | null;
	acupuncture_rate: number | null;
	per_hour: number | null;

	@Column({
		type: 'enum',
		enum: Language,
		select: false,
		default: Language.ENGLISH,
	})
	language: Language;

	@Column({
		select: false,
		default: false,
	})
	dark_mode: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(() => EmployeeRecord, (record) => record.employee, {
		eager: true,
	})
	records: EmployeeRecord[];

	@AfterUpdate()
	async updateRecords() {
		const { employee_id, username, first_name, last_name, gender, role } = this;

		EmployeeRecord.update(
			{ employee_id },
			{ username, first_name, last_name, gender, role }
		);
	}

	@AfterInsert()
	async addInitialRecord() {
		const {
			employee_id,
			valid_from,
			username,
			first_name,
			last_name,
			gender,
			role,
			body_rate,
			feet_rate,
			acupuncture_rate,
			per_hour,
		} = this;

		const record = EmployeeRecord.create({
			employee_id,
			valid_from,
			username,
			first_name,
			last_name,
			gender,
			role,
			body_rate,
			feet_rate,
			acupuncture_rate,
			per_hour,
		});

		record.save();
	}
}
