import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
} from 'typeorm';
import { Gender, Language, Permissions, Role } from './enums';
import { Schedule } from './schedule.models';

@Entity('Employees')
export class Employee extends BaseEntity {
	@PrimaryGeneratedColumn()
	employee_id: number;

	@Column({
		unique: true,
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
		type: 'set',
		enum: Permissions,
	})
	permissions: Permissions[];

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
	body_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
	feet_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
	acupuncture_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
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

	@Column({
		select: false,
		name: 'active',
		default: true,
	})
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => Schedule, (schedule) => schedule.employee)
	schedules: Schedule[];
}
