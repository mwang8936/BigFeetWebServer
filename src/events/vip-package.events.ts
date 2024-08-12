export const update_vip_package_event = 'update-vip-package-event';
export const add_vip_package_event = 'add-vip-package-event';
export const delete_vip_package_event = 'delete-vip-package-event';

export interface VipPackageEventMessage {
	employee_ids: number[];
	serial: string;
}
