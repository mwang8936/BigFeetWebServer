import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	BeforeUpdate,
	BeforeInsert,
	AfterLoad,
} from 'typeorm';

import { Customer } from './customer.models';
import { Gender, TipMethod } from './enums';
import { Schedule } from './schedule.models';
import { Service } from './service.models';

import { DataStructureError } from '../exceptions/data-structure.error';

import * as ScheduleServices from '../services/schedule.services';

@Entity('reservations')
export class Reservation extends BaseEntity {
	@PrimaryGeneratedColumn()
	reservation_id: number;

	@Column({
		type: 'timestamptz',
	})
	reserved_date: Date;

	@ManyToOne(() => Schedule, (schedule) => schedule.reservations, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn([
		{ name: 'year', referencedColumnName: 'year' },
		{ name: 'month', referencedColumnName: 'month' },
		{ name: 'day', referencedColumnName: 'day' },
		{ name: 'employee_id', referencedColumnName: 'employee_id' },
	])
	schedule: Schedule;

	@Column()
	year: number;

	@Column()
	month: number;

	@Column()
	day: number;

	date: string;

	@Column()
	employee_id: number;

	@ManyToOne(() => Service, (service) => service.reservations, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'service_id',
	})
	service: Service;

	@Column({
		type: 'integer',
		nullable: true,
	})
	time: number | null;

	@Column({
		type: 'integer',
		nullable: true,
	})
	beds_required: number | null;

	@ManyToOne(() => Customer, (customer) => customer.reservations, {
		cascade: true,
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
		eager: true,
		nullable: true,
	})
	@JoinColumn({
		name: 'customer_id',
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
		nullable: true,
		transformer: {
			to(cash: number | null) {
				return cash;
			},
			from(cash: string | null) {
				return cash === null ? null : Number(cash);
			},
		},
	})
	cash: number | null;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		nullable: true,
		transformer: {
			to(machine: number | null) {
				return machine;
			},
			from(machine: string | null) {
				return machine === null ? null : Number(machine);
			},
		},
	})
	machine: number | null;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		nullable: true,
		transformer: {
			to(vip: number | null) {
				return vip;
			},
			from(vip: string | null) {
				return vip === null ? null : Number(vip);
			},
		},
	})
	vip: number | null;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		nullable: true,
		transformer: {
			to(giftCard: number | null) {
				return giftCard;
			},
			from(giftCard: string | null) {
				return giftCard === null ? null : Number(giftCard);
			},
		},
	})
	gift_card: number | null;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		nullable: true,
		transformer: {
			to(insurance: number | null) {
				return insurance;
			},
			from(insurance: string | null) {
				return insurance === null ? null : Number(insurance);
			},
		},
	})
	insurance: number | null;

	@Column({
		type: 'decimal',
		precision: 6,
		scale: 2,
		nullable: true,
		transformer: {
			to(tips: number | null) {
				return tips;
			},
			from(tips: string | null) {
				return tips === null ? null : Number(tips);
			},
		},
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

	@BeforeInsert()
	@BeforeUpdate()
	async beforeFunction() {
		await this.checkEndTime();
		await this.ensureScheduleExists();
	}

	private async checkEndTime() {
		const { reserved_date, service, time } = this;

		const maxEndDate = new Date(
			reserved_date.getTime() + service.time * (1000 * 60)
		);

		if (time) {
			const endDate = new Date(reserved_date.getTime() + time * (1000 * 60));

			if (endDate < reserved_date)
				throw new DataStructureError(
					'Reservation',
					`end: ${endDate.toLocaleTimeString(
						'en-US'
					)} must be after reserved date: ${reserved_date.toLocaleTimeString(
						'en-US'
					)}`
				);

			if (endDate > maxEndDate)
				throw new DataStructureError(
					'Reservation',
					`end: ${endDate.toLocaleTimeString(
						'en-US'
					)} must be before reserved end date: ${maxEndDate.toLocaleTimeString(
						'en-US'
					)}`
				);
		}
	}

	private async ensureScheduleExists() {
		const { employee_id, year, month, day } = this;

		let schedule = await ScheduleServices.getSchedule(
			{ year, month, day },
			employee_id
		);

		if (!schedule) {
			schedule = await ScheduleServices.createSchedule(
				{ year, month, day },
				employee_id
			);
		}

		if (schedule) {
			this.schedule = schedule;
		}
	}

	@AfterLoad()
	async setDate() {
		const { year, month, day } = this;

		this.date = `${year}-${month}-${day}`;
	}
}
