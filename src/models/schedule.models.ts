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

import { Employee } from './employee.models';
import { Reservation } from './reservation.models';
import { VipPackage } from './vip-package.models';

import { DataStructureError } from '../exceptions/data-structure.error';
import { isValidDate } from '../utils/date.utils';

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

	@Column({
		default: false,
	})
	signed: boolean;

	@BeforeInsert()
	@BeforeUpdate()
	async beforeFunction() {
		this.checkStartEndValid();
		this.checkDateValid();
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

	@AfterLoad()
	async setDate() {
		const { year, month, day } = this;

		this.date = `${year}-${month}-${day}`;
	}
}
