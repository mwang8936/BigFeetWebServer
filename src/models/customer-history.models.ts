import {
	Entity,
	BaseEntity,
	Column,
	OneToMany,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

import { Customer } from './customer.models';
import { Reservation } from './reservation.models';

@Entity('customer_history')
export class CustomerHistory extends BaseEntity {
	@ManyToOne(() => Customer, (customer) => customer.histories, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'customer_id',
	})
	customer: Customer;

	@PrimaryColumn()
	customer_id: number;

	@PrimaryColumn({
		type: 'timestamptz',
	})
	valid_from: Date;

	@Column({
		type: 'timestamptz',
		nullable: true,
	})
	valid_to?: Date | null;

	@Column({
		type: 'varchar',
		length: 10,
		nullable: true,
	})
	phone_number: string | null;

	@Column({
		type: 'varchar',
		length: 6,
		nullable: true,
	})
	vip_serial: string | null;

	@Column({
		type: 'varchar',
		length: 60,
		nullable: true,
	})
	customer_name: string | null;

	@Column({
		type: 'text',
		nullable: true,
	})
	notes: string | null;

	@OneToMany(() => Reservation, (reservation) => reservation.customer)
	reservations: Reservation[];
}
