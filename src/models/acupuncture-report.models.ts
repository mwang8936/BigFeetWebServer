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
} from 'typeorm';

import { Employee } from './employee.models';
import { Reservation } from './reservation.models';

interface DataRow {
	date: string;
	acupuncture: number;
	massage: number;
	insurance: number;
	non_acupuncturist_insurance: number;
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

	@ManyToOne(() => Employee, (employee) => employee.acupuncture_reports, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'employee_id',
	})
	employee: Employee;

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

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 4,
		default: 0.7,
		transformer: {
			to(non_acupunturist_insurance_percentage: number) {
				return non_acupunturist_insurance_percentage;
			},
			from(non_acupunturist_insurance_percentage: string) {
				return Number(non_acupunturist_insurance_percentage);
			},
		},
	})
	non_acupuncturist_insurance_percentage: number;

	data: DataRow[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

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

			const nonAcupuncturistInsurance = nonAcupuncturistReservations
				.map((reservation) => reservation.insurance ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const dataRow: DataRow = {
				date,
				acupuncture,
				massage,
				insurance,
				non_acupuncturist_insurance: nonAcupuncturistInsurance,
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
