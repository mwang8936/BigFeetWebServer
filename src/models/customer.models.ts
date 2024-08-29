import {
	Entity,
	BaseEntity,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	BeforeInsert,
	BeforeUpdate,
	AfterInsert,
	AfterUpdate,
	AfterSoftRemove,
	AfterRecover,
} from 'typeorm';

import { CustomerHistory } from './customer-history.models';

import { DataStructureError } from '../exceptions/data-structure.error';

@Entity('customers')
export class Customer extends BaseEntity {
	@PrimaryGeneratedColumn()
	customer_id: number;

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

	@CreateDateColumn({
		type: 'timestamptz',
	})
	created_at: Date;

	@UpdateDateColumn({
		type: 'timestamptz',
	})
	updated_at: Date;

	@DeleteDateColumn({
		type: 'timestamptz',
	})
	deleted_at: Date | null;

	@OneToMany(() => CustomerHistory, (history) => history.customer)
	histories: CustomerHistory[];

	@BeforeInsert()
	@BeforeUpdate()
	async checkPhoneNumberOrVipSerialExists() {
		const { phone_number, vip_serial } = this;

		if (phone_number === null && vip_serial === null) {
			throw new DataStructureError(
				'Schedule',
				'phone number and vip serial cannot both be empty.'
			);
		}
	}

	@AfterInsert()
	async addInitialHistory() {
		const { customer_id, phone_number, vip_serial, customer_name, notes } =
			this;

		const history = CustomerHistory.create({
			customer_id,
			valid_from: new Date(Date.UTC(1900, 0, 1)),
			phone_number,
			vip_serial,
			customer_name,
			notes,
		});

		history.save();
	}

	@AfterUpdate()
	async addHistorySetPreviousHistoryInvalid() {
		const {
			customer_id,
			phone_number,
			vip_serial,
			customer_name,
			notes,
			updated_at,
		} = this;

		const mostRecentHistory = await CustomerHistory.findOne({
			where: {
				customer_id,
			},
			order: {
				valid_from: 'DESC',
			},
		});

		if (mostRecentHistory) {
			mostRecentHistory.valid_to = updated_at;

			mostRecentHistory.save();
		}

		const history = CustomerHistory.create({
			customer_id,
			valid_from: updated_at,
			phone_number,
			vip_serial,
			customer_name,
			notes,
		});

		history.save();
	}

	@AfterSoftRemove()
	async setMostRecentHistoryInvalid() {
		const { customer_id, deleted_at } = this;

		const mostRecentHistory = await CustomerHistory.findOne({
			where: {
				customer_id,
			},
			order: {
				valid_from: 'DESC',
			},
		});

		if (mostRecentHistory) {
			mostRecentHistory.valid_to = deleted_at;

			mostRecentHistory.save();
		}
	}

	@AfterRecover()
	async setMostRecentHistoryValid() {
		const { customer_id } = this;

		const mostRecentHistory = await CustomerHistory.findOne({
			where: {
				customer_id,
			},
			order: {
				valid_from: 'DESC',
			},
		});

		if (mostRecentHistory?.valid_to) {
			mostRecentHistory.valid_to = null;

			mostRecentHistory.save();
		}
	}
}
