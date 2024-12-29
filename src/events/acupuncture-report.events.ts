export const acupuncture_reports_channel = 'acupuncture-reports-channel';

export const update_acupuncture_report_event =
	'update-acupuncture-report-event';
export const add_acupuncture_report_event = 'add-acupuncture-report-event';
export const delete_acupuncture_report_event =
	'delete-acupuncture-report-event';
export const recover_acupuncture_report_event =
	'recover-acupuncture-report-event';

export interface AcupunctureReportEventMessage {
	username: string;
}
