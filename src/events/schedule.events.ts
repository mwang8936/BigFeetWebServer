export const schedules_channel = 'schedules-channel';

export const sign_schedule_event = 'sign-schedule-event';
export const update_schedule_event = 'update-schedule-event';
export const add_schedule_event = 'add-schedule-event';
export const delete_schedule_event = 'delete-schedule-event';

export interface ScheduleEventMessage {
	employee_id: number;
	username: string;
}
