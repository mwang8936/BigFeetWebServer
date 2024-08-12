export const update_reservation_event = 'update-reservation-event';
export const add_reservation_event = 'add-reservation-event';
export const delete_reservation_event = 'delete-reservation-event';

export interface ReservationEventMessage {
	time: string;
	employee_id: number;
	username: string;
	created_by: string;
	update_customers: boolean;
}
