import {
	Entity,
	BaseEntity,
	Column,
	PrimaryGeneratedColumn,
	DeleteDateColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	AfterInsert,
	AfterUpdate,
} from 'typeorm';

import { ServiceColor } from './enums';
import { ServiceRecord } from './service-record.models';

@Entity('services')
export class Service extends BaseEntity {
	@PrimaryGeneratedColumn()
	service_id: number;

	valid_from: string;

	@Column({
		length: 30,
		unique: true,
	})
	service_name: string;

	@Column({
		length: 20,
		unique: true,
	})
	shorthand: string;

	time: number;
	money: number;
	body: number;
	feet: number;
	acupuncture: number;
	beds_required: number;

	@Column({
		type: 'enum',
		enum: ServiceColor,
	})
	color: ServiceColor;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(() => ServiceRecord, (record) => record.service, {
		eager: true,
	})
	records: ServiceRecord[];

	@AfterUpdate()
	async updateRecords() {
		const { service_id, service_name, shorthand, color } = this;

		ServiceRecord.update({ service_id }, { service_name, shorthand, color });
	}

	@AfterInsert()
	async addInitialRecord() {
		const {
			service_id,
			valid_from,
			service_name,
			shorthand,
			time,
			money,
			body,
			feet,
			acupuncture,
			beds_required,
			color,
		} = this;

		const record = ServiceRecord.create({
			service_id,
			valid_from,
			service_name,
			shorthand,
			time,
			money,
			body,
			feet,
			acupuncture,
			beds_required,
			color,
		});

		record.save();
	}
}
