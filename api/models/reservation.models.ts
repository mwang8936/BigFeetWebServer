import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Service } from './service.models';
import { Customer } from './customer.models';
import { Gender, TipMethod } from './enums';
import { Schedule } from './schedule.models';

@Entity('Reservations')
export class Reservation extends BaseEntity {
	@PrimaryGeneratedColumn()
	reservation_id: number;

	@ManyToOne(() => Schedule, (schedule) => schedule.reservations, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn([
		{ name: 'date', referencedColumnName: 'date' },
		{ name: 'employee_id', referencedColumnName: 'employee_id' },
	])
	schedule: Schedule;

	@Column()
	employee_id: number;

	@Column()
	date: Date;

	@Column({
		type: 'datetime',
	})
	reserved_date: Date;

	@ManyToOne(() => Service, (service) => service.reservations, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'service_id',
	})
	service: Service;

	@ManyToOne(() => Customer, (customer) => customer.reservations, {
		cascade: true,
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
		eager: true,
		nullable: true,
	})
	@JoinColumn({
		name: 'phone_number',
	})
	customer: Customer | null;

	@Column({
		type: 'enum',
		enum: Gender,
		nullable: true,
	})
	requested_gender: Gender | null;

	@Column({
		default: false,
	})
	requested_employee: boolean;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
	cash: number | null;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
	machine: number | null;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
	vip: number | null;

	@Column({
		type: 'decimal',
		precision: 6,
		scale: 2,
		unsigned: true,
		nullable: true,
	})
	tips: number | null;

	@Column({
		type: 'enum',
		enum: TipMethod,
		nullable: true,
	})
	tip_method: TipMethod | null;

	@Column({
		type: 'text',
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		nullable: true,
	})
	message: string | null;

	@Column({
		length: 200,
	})
	created_by: string;

	@CreateDateColumn()
	created_at: Date;

	@Column({
		length: 200,
	})
	updated_by: string;

	@UpdateDateColumn()
	updated_at: Date;
}
