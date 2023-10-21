import { Entity, BaseEntity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Reservation } from './reservation.models';

@Entity('Customers')
export class Customer extends BaseEntity {
	@PrimaryColumn({
		length: 10,
	})
	phone_number: string;

	@Column({
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 60,
	})
	customer_name: string;

	@Column({
		type: 'text',
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		nullable: true,
	})
	notes: string | null;

	@OneToMany(() => Reservation, (reservation) => reservation.customer)
	reservations: Reservation[];
}
