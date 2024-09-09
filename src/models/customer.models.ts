import {
	Entity,
	BaseEntity,
	OneToMany,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	AfterInsert,
	BeforeInsert,
	Column,
	BeforeUpdate,
} from 'typeorm';

import { CustomerRecord } from './customer-record.models';

import { DataStructureError } from '../exceptions/data-structure.error';
import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';

@Entity('customers')
export class Customer extends BaseEntity {
	@PrimaryGeneratedColumn()
	customer_id: number;

	valid_from: string;

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

	customer_name: string | null;
	notes: string | null;

	@CreateDateColumn({
		type: 'timestamptz',
	})
	created_at: Date;

	@DeleteDateColumn({
		type: 'timestamptz',
	})
	deleted_at: Date | null;

	@OneToMany(() => CustomerRecord, (record) => record.customer, {
		eager: true,
	})
	records: CustomerRecord[];

	@BeforeInsert()
	@BeforeUpdate()
	async beforeFunction() {
		this.checkPhoneNumberOrVipSerialExists();
		this.checkPhoneNumberOrVipSerialDuplicates();
	}

	private async checkPhoneNumberOrVipSerialExists() {
		const { phone_number, vip_serial } = this;

		if (phone_number === null && vip_serial === null) {
			throw new DataStructureError(
				'Customer',
				"'phone number' and 'vip serial' cannot both be empty."
			);
		}
	}

	private async checkPhoneNumberOrVipSerialDuplicates() {
		const { phone_number, vip_serial } = this;

		if (phone_number !== null) {
			const duplicates = await Customer.find({
				where: {
					phone_number,
				},
			});

			if (duplicates.length > 0) {
				throw new DuplicateIdentifierError(
					'Customer',
					'phone number',
					phone_number
				);
			}
		} else if (vip_serial !== null) {
			const duplicates = await Customer.find({
				where: {
					vip_serial,
				},
			});

			if (duplicates.length > 0) {
				throw new DuplicateIdentifierError(
					'Customer',
					'VIP Serial',
					vip_serial as string
				);
			}
		}
	}

	@AfterInsert()
	async addInitialRecord() {
		const { customer_id, valid_from, customer_name, notes } = this;

		const record = CustomerRecord.create({
			customer_id,
			valid_from,
			customer_name,
			notes,
		});

		record.save();
	}
}
