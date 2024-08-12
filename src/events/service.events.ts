export const services_channel = 'services-channel';

export const update_service_event = 'update-service-event';
export const add_service_event = 'add-service-event';
export const delete_service_event = 'delete-service-event';
export const recover_service_event = 'recover-service-event';

export interface ServiceEventMessage {
	service_name: string;
}
