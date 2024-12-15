import {
	Entity,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
	AfterLoad,
	Column,
	Check,
	BeforeInsert,
	BeforeUpdate,
	Brackets,
} from 'typeorm';

import { EmployeeRecord } from './employee-record.model';
import { Reservation } from './reservation.models';

import { NotFoundError } from '../exceptions/not-found-error';

interface DataRow {
	date: string;
	acupuncture: number;
	massage: number;
	insurance: number;
}

@Check(`"year" >= 2020`)
@Check(`"month" >= 1 AND month <= 12`)
@Entity('acupuncture_report')
export class AcupunctureReport extends BaseEntity {
	@PrimaryColumn()
	year: number;

	@PrimaryColumn()
	month: number;

	@PrimaryColumn()
	employee_id: number;

	@PrimaryColumn()
	employee_valid_from: string;

	@ManyToOne(() => EmployeeRecord, (employee) => employee.acupuncture_reports, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn([
		{ name: 'employee_id', referencedColumnName: 'employee_id' },
		{ name: 'employee_valid_from', referencedColumnName: 'valid_from' },
	])
	employee: EmployeeRecord;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.7,
		transformer: {
			to(acupuncture_percentage: number) {
				return acupuncture_percentage;
			},
			from(acupuncture_percentage: string) {
				return Number(acupuncture_percentage);
			},
		},
	})
	acupuncture_percentage: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.3,
		transformer: {
			to(massage_percentage: number) {
				return massage_percentage;
			},
			from(massage_percentage: string) {
				return Number(massage_percentage);
			},
		},
	})
	massage_percentage: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.3,
		transformer: {
			to(insurance_percentage: number) {
				return insurance_percentage;
			},
			from(insurance_percentage: string) {
				return Number(insurance_percentage);
			},
		},
	})
	insurance_percentage: number;

	data: DataRow[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async ensureValidEmployee() {
		const { year, month, employee } = this;

		const employeeId = employee.employee_id;

		const employeeRecord = await EmployeeRecord.createQueryBuilder(
			'employeeRecord'
		)
			.where('employeeRecord.employee_id = :employeeId', { employeeId })
			.andWhere('employeeRecord.valid_from <= MAKE_DATE(:year, :month, 1)', {
				year,
				month,
			})
			.andWhere(
				new Brackets((qb) => {
					qb.where('employeeRecord.valid_to IS NULL').orWhere(
						'employeeRecord.valid_to > MAKE_DATE(:year, :month, 1)',
						{ year, month }
					);
				})
			)
			.orderBy('employeeRecord.valid_from', 'ASC')
			.getOne();

		if (!employeeRecord)
			throw new NotFoundError('Employee', 'employee id', employeeId);

		this.employee = employeeRecord;
	}

	@AfterLoad()
	async setData() {
		const { year, month, employee_id } = this;

		const reservations = await Reservation.find({
			where: {
				year,
				month,
			},
			order: {
				day: 'ASC',
			},
		});

		const reservationsByDate: Reservation[][] =
			this.groupReservationsByDate(reservations);

		this.data = [];

		reservationsByDate.forEach((reservations) => {
			const date = reservations[0].date;

			const acupunctureReservations = reservations.filter(
				(reservation) => reservation.service.acupuncture > 0
			);

			const acupuncturistReservations: Reservation[] = [];
			const nonAcupuncturistReservations: Reservation[] = [];

			acupunctureReservations.forEach((reservation) => {
				if (reservation.employee_id === employee_id) {
					acupuncturistReservations.push(reservation);
				} else {
					nonAcupuncturistReservations.push(reservation);
				}
			});

			const acupuncture = acupuncturistReservations
				.flatMap((reservation) => [
					reservation.cash ?? 0,
					reservation.machine ?? 0,
					reservation.vip ?? 0,
					reservation.gift_card ?? 0,
				])
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const massage = nonAcupuncturistReservations
				.flatMap((reservation) => [
					reservation.cash ?? 0,
					reservation.machine ?? 0,
					reservation.vip ?? 0,
					reservation.gift_card ?? 0,
				])
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const insurance = acupuncturistReservations
				.map((reservation) => reservation.insurance ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const dataRow: DataRow = {
				date,
				acupuncture,
				massage,
				insurance,
			};

			this.data.push(dataRow);
		});
	}

	private groupReservationsByDate(
		reservations: Reservation[]
	): Reservation[][] {
		const groupedReservations: Reservation[][] = [];

		// Create a map to group reservations by day
		const reservationMap = new Map<number, Reservation[]>();

		// Group reservations by day
		reservations.forEach((reservation) => {
			const day = reservation.day;

			if (!reservationMap.has(day)) {
				reservationMap.set(day, []);
			}
			reservationMap.get(day)!.push(reservation);
		});

		// Convert the map to a 2-D array
		reservationMap.forEach((dayReservations) => {
			groupedReservations.push(dayReservations);
		});

		return groupedReservations;
	}
}
