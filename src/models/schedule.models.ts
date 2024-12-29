import {
	Entity,
	BaseEntity,
	Column,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
	BeforeInsert,
	BeforeUpdate,
	Check,
	AfterLoad,
} from 'typeorm';

import { DateTime } from 'luxon';

import { Employee } from './employee.models';
import { Reservation } from './reservation.models';
import { VipPackage } from './vip-package.models';

import * as PayrollServices from '../services/payroll.services';
import * as ReservationServices from '../services/reservation.services';

import { DataStructureError } from '../exceptions/data-structure.error';
import { isValidDate } from '../utils/date.utils';
import { Payroll } from './payroll.models';
import { PayrollPart } from './enums';

@Entity('schedules')
@Check(`"year" >= 2020`)
@Check(`"month" >= 1 AND month <= 12`)
@Check(`"day" >= 1 AND day <= 31`)
export class Schedule extends BaseEntity {
	@PrimaryColumn()
	year: number;

	@PrimaryColumn()
	month: number;

	@PrimaryColumn()
	day: number;

	@Column({
		type: 'enum',
		enum: PayrollPart,
		nullable: true,
	})
	part: PayrollPart | null;

	date: string;

	@PrimaryColumn()
	employee_id: number;

	@ManyToOne(() => Employee, (employee) => employee.schedules, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'employee_id',
	})
	employee: Employee;

	@Column({
		name: 'working',
		default: false,
	})
	is_working: boolean;

	@Column({
		default: false,
	})
	on_call: boolean;

	@Column({
		type: 'time',
		nullable: true,
	})
	start: Date | null;

	@Column({
		type: 'time',
		nullable: true,
	})
	end: Date | null;

	@Column({
		type: 'integer',
		nullable: true,
	})
	priority: number | null;

	@Column({
		default: false,
	})
	add_award: boolean;

	award: number;

	@OneToMany(() => Reservation, (reservation) => reservation.schedule, {
		eager: true,
	})
	reservations: Reservation[];

	@ManyToMany(() => VipPackage, (vipPackage) => vipPackage.schedules, {
		cascade: true,
		eager: true,
	})
	@JoinTable({
		joinColumns: [
			{ name: 'year', referencedColumnName: 'year' },
			{ name: 'month', referencedColumnName: 'month' },
			{ name: 'day', referencedColumnName: 'day' },
			{ name: 'employee_id', referencedColumnName: 'employee_id' },
		],
		inverseJoinColumns: [
			{ name: 'vip_package_id', referencedColumnName: 'vip_package_id' },
		],
	})
	vip_packages: VipPackage[];

	@ManyToOne(() => Payroll, (payroll) => payroll.schedules, {
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
		nullable: true,
	})
	@JoinColumn([
		{ name: 'year', referencedColumnName: 'year' },
		{ name: 'month', referencedColumnName: 'month' },
		{ name: 'part', referencedColumnName: 'part' },
		{ name: 'employee_id', referencedColumnName: 'employee_id' },
	])
	payroll: Payroll | null;

	@Column({
		default: false,
	})
	signed: boolean;

	@AfterLoad()
	async attachAward() {
		const { year, month, day, add_award } = this;

		if (add_award) {
			const start = DateTime.fromObject(
				{ year, month, day },
				{ zone: 'America/Los_Angeles' }
			).startOf('day');
			const end = DateTime.fromObject(
				{ year, month, day },
				{ zone: 'America/Los_Angeles' }
			).endOf('day');

			const reservations = await ReservationServices.getReservations(
				start.toJSDate(),
				end.toJSDate()
			);

			const totalSessions = reservations
				.flatMap((reservation) => [
					reservation.service.acupuncture * 1.5,
					reservation.service.feet,
					reservation.service.body,
				])
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			this.award = totalSessions;
		} else {
			this.award = 0;
		}
	}

	@BeforeInsert()
	async beforeInsert() {
		await this.checkStartEndValid();
		await this.checkDateValid();
		await this.assignPayroll();
	}

	@BeforeUpdate()
	async beforeUpdate() {
		await this.checkStartEndValid();
		await this.checkDateValid();
	}

	private async checkStartEndValid() {
		const { start, end } = this;

		const timeStringToDate = (time: string | Date) => {
			if (typeof time === 'string') {
				const [hours, minutes, seconds] = time.split(':').map(Number);

				const date = new Date();

				date.setHours(hours, minutes, seconds, 0);

				return date;
			} else {
				return time;
			}
		};

		const compareTimes = (date1: Date, date2: Date) => {
			const hours1 = date1.getHours();
			const minutes1 = date1.getMinutes();
			const seconds1 = date1.getSeconds();

			const hours2 = date2.getHours();
			const minutes2 = date2.getMinutes();
			const seconds2 = date2.getSeconds();

			if (hours1 !== hours2) {
				return hours1 - hours2;
			}
			if (minutes1 !== minutes2) {
				return minutes1 - minutes2;
			}
			return seconds1 - seconds2;
		};

		if (end) {
			if (start) {
				if (compareTimes(timeStringToDate(start), timeStringToDate(end)) > 0) {
					throw new DataStructureError(
						'Schedule',
						`start: ${start.toLocaleTimeString(
							'en-US'
						)} must be before end: ${end.toLocaleTimeString('en-US')}`
					);
				}
			} else {
				throw new DataStructureError(
					'Schedule',
					'end cannot exist without start'
				);
			}
		}
	}

	private async checkDateValid() {
		const { year, month, day } = this;
		if (!isValidDate(year, month, day)) {
			throw new DataStructureError('Schedule', 'invalid date');
		}
	}

	private async assignPayroll() {
		const { year, month, day, employee_id } = this;

		let part = PayrollPart.PART_1;

		if (day >= 16 && day <= 31) {
			part = PayrollPart.PART_2;
		}

		let payroll = await PayrollServices.getPayroll(
			year,
			month,
			part,
			employee_id
		);

		if (payroll) {
			this.payroll = payroll;
		}
	}

	@AfterLoad()
	async setDate() {
		const { year, month, day } = this;

		this.date = `${year}-${month}-${day}`;
	}
}
