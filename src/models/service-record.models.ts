import {
	Entity,
	BaseEntity,
	Column,
	OneToMany,
	DeleteDateColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';

import { ServiceColor } from './enums';
import { Reservation } from './reservation.models';
import { Service } from './service.models';

import { DataStructureError } from '../exceptions/data-structure.error';

@Entity('service_history')
export class ServiceRecord extends BaseEntity {
	@ManyToOne(() => Service, (service) => service.records, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({
		name: 'service_id',
	})
	service: Service;

	@PrimaryColumn()
	service_id: number;

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
		length: 30,
	})
	service_name: string;

	@Column({
		length: 20,
	})
	shorthand: string;

	@Column({
		type: 'integer',
	})
	time: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		transformer: {
			to(money: number) {
				return money;
			},
			from(money: string) {
				return Number(money);
			},
		},
	})
	money: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		default: 0,
		transformer: {
			to(body: number) {
				return body;
			},
			from(body: string) {
				return Number(body);
			},
		},
	})
	body: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		default: 0,
		transformer: {
			to(feet: number) {
				return feet;
			},
			from(feet: string) {
				return Number(feet);
			},
		},
	})
	feet: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		default: 0,
		transformer: {
			to(acupuncture: number) {
				return acupuncture;
			},
			from(acupuncture: string) {
				return Number(acupuncture);
			},
		},
	})
	acupuncture: number;

	@Column({
		type: 'integer',
		default: 0,
	})
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

	@OneToMany(() => Reservation, (reservation) => reservation.service)
	reservations: Reservation[];

	@BeforeInsert()
	async beforeInsert() {
		this.checkValidDates();
		this.ensureServiceExists();
	}

	@BeforeUpdate()
	async beforeUpdate() {
		this.checkValidDates();
	}

	private async checkValidDates() {
		const { valid_from, valid_to } = this;

		if (valid_to !== null && valid_from >= valid_to) {
			throw new DataStructureError(
				'Service',
				"'valid from' must be before 'valid to'."
			);
		}
	}

	async ensureServiceExists() {
		const { service_id } = this;

		const service = await Service.findOne({
			where: {
				service_id,
			},
		});

		if (!service) {
			throw new DataStructureError(
				'Service',
				'Record must be for existing service.'
			);
		} else {
			this.service_name = service.service_name;
			this.shorthand = service.shorthand;
			this.color = service.color;
		}
	}
}
