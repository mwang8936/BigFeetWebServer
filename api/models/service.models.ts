import {
	Entity,
	BaseEntity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
} from 'typeorm';
import { Reservation } from './reservation.models';
import { ServiceColor } from './enums';

@Entity('Services')
export class Service extends BaseEntity {
	@PrimaryGeneratedColumn()
	service_id: number;

	@Column({
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		unique: true,
		length: 30,
	})
	service_name: string;

	@Column({
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		unique: true,
		length: 20,
	})
	shorthand: string;

	@Column({
		type: 'integer',
		width: 3,
		unsigned: true,
	})
	time: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		unsigned: true,
	})
	money: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		unsigned: true,
		default: 0,
	})
	body: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		unsigned: true,
		default: 0,
	})
	feet: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		unsigned: true,
		default: 0,
	})
	accupuncture: number;

	@Column({
		type: 'enum',
		enum: ServiceColor,
	})
	color: ServiceColor;

	@Column({
		select: false,
		name: 'active',
		default: true,
	})
	is_active: boolean;

	@OneToMany(() => Reservation, (reservation) => reservation.service)
	reservations: Reservation[];
}
