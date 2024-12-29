export const payrolls_channel = 'payrolls-channel';

export const update_payroll_event = 'update-payroll-event';
export const add_payroll_event = 'add-payroll-event';
export const delete_payroll_event = 'delete-payroll-event';
export const recover_payroll_event = 'recover-payroll-event';

export interface PayrollEventMessage {
	username: string;
}
