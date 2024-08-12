export const employees_channel = 'employees-channel';

export const update_employee_event = 'update-employee-event';
export const add_employee_event = 'add-employee-event';
export const delete_employee_event = 'delete-employee-event';
export const recover_employee_event = 'recover-employee-event';

export interface EmployeeEventMessage {
	username: string;
}
