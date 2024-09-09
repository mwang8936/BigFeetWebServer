import {
	Entity,
	BaseEntity,
	Column,
	OneToMany,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';

import { Customer } from './customer.models';
import { Reservation } from './reservation.models';

import { DataStructureError } from '../exceptions/data-structure.error';

@Entity('customer_history')
export class CustomerRecord extends BaseEntity {
	@ManyToOne(() => Customer, (customer) => customer.records, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({
		name: 'customer_id',
	})
	customer: Customer;

	@PrimaryColumn()
	customer_id: number;

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

	@BeforeInsert()
	@BeforeUpdate()
	async checkValidDates() {
		const { valid_from, valid_to } = this;

		if (valid_to !== null && valid_from >= valid_to) {
			throw new DataStructureError(
				'Customer',
				"'valid from' must be before 'valid to'."
			);
		}
	}
}
