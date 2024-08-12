export const customers_channel = 'customers-channel';

export const update_customer_event = 'update-customer-event';
export const add_customer_event = 'add-customer-event';
export const delete_customer_event = 'delete-customer-event';
export const recover_customer_event = 'recover-customer-event';

export interface CustomerEventMessage {
	phone_number: string | null;
	vip_serial: string | null;
}
