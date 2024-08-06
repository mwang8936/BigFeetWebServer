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
import { Gender, Language, Permissions, Role } from './enums';
import { Schedule } from './schedule.models';

@Entity('Employees')
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
		transformer: {
			to(bodyRate: number | null) {
				return bodyRate;
			},
			from(bodyRate: number | null) {
				return bodyRate === null ? null : Number(bodyRate);
			},
		},
	})
	body_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		unsigned: true,
		nullable: true,
		transformer: {
			to(feetRate: number | null) {
				return feetRate;
			},
			from(feetRate: number | null) {
				return feetRate === null ? null : Number(feetRate);
			},
		},
	})
	feet_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		unsigned: true,
		nullable: true,
		transformer: {
			to(acupunctureRate: number | null) {
				return acupunctureRate;
			},
			from(acupunctureRate: number | null) {
				return acupunctureRate === null ? null : Number(acupunctureRate);
			},
		},
	})
	acupuncture_rate: number | null;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 2,
		unsigned: true,
		nullable: true,
		transformer: {
			to(perHour: number | null) {
				return perHour;
			},
			from(perHour: number | null) {
				return perHour === null ? null : Number(perHour);
			},
		},
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

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(() => Schedule, (schedule) => schedule.employee)
	schedules: Schedule[];
}
