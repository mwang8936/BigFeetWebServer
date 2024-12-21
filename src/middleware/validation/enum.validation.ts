import { Joi } from 'celebrate';

import { acupuncture_reports_channel } from '../../events/acupuncture-report.events';
import { customers_channel } from '../../events/customer.events';
import { employees_channel } from '../../events/employee.events';
import { gift_cards_channel } from '../../events/gift-card.events';
import { payrolls_channel } from '../../events/payroll.events';
import { schedules_channel } from '../../events/schedule.events';
import { services_channel } from '../../events/service.events';

import {
	Gender,
	Language,
	PaymentMethod,
	PayrollOption,
	PayrollPart,
	Permissions,
	Role,
	ServiceColor,
	TipMethod,
} from '../../models/enums';

export const channelValidation = Joi.string().valid(
	acupuncture_reports_channel,
	customers_channel,
	employees_channel,
	gift_cards_channel,
	payrolls_channel,
	schedules_channel,
	services_channel
);

export const colorValidation = Joi.string().valid(
	ServiceColor.RED,
	ServiceColor.BLUE,
	ServiceColor.YELLOW,
	ServiceColor.GREEN,
	ServiceColor.ORANGE,
	ServiceColor.PURPLE,
	ServiceColor.GRAY,
	ServiceColor.BLACK
);

export const genderValidation = Joi.string().valid(Gender.MALE, Gender.FEMALE);

export const languageValidation = Joi.string().valid(
	Language.ENGLISH,
	Language.SIMPLIFIED_CHINESE,
	Language.TRADITIONAL_CHINESE
);

export const paymentMethodValidation = Joi.string().valid(
	PaymentMethod.CASH,
	PaymentMethod.MACHINE
);

export const payrollOptionValidation = Joi.string().valid(
	PayrollOption.ACUPUNCTURIST,
	PayrollOption.RECEPTIONIST,
	PayrollOption.STORE_EMPLOYEE,
	PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH
);

export const payrollPartValidation = Joi.number().valid(
	PayrollPart.PART_1,
	PayrollPart.PART_2
);

export const permissionsValidation = Joi.array().items(
	Joi.string().valid(
		Permissions.PERMISSION_GET_CUSTOMER,
		Permissions.PERMISSION_UPDATE_CUSTOMER,
		Permissions.PERMISSION_ADD_CUSTOMER,
		Permissions.PERMISSION_DELETE_CUSTOMER,
		Permissions.PERMISSION_GET_EMPLOYEE,
		Permissions.PERMISSION_UPDATE_EMPLOYEE,
		Permissions.PERMISSION_ADD_EMPLOYEE,
		Permissions.PERMISSION_DELETE_EMPLOYEE,
		Permissions.PERMISSION_GET_GIFT_CARD,
		Permissions.PERMISSION_UPDATE_GIFT_CARD,
		Permissions.PERMISSION_ADD_GIFT_CARD,
		Permissions.PERMISSION_DELETE_GIFT_CARD,
		Permissions.PERMISSION_GET_PAYROLL,
		Permissions.PERMISSION_UPDATE_PAYROLL,
		Permissions.PERMISSION_ADD_PAYROLL,
		Permissions.PERMISSION_DELETE_PAYROLL,
		Permissions.PERMISSION_GET_SCHEDULE,
		Permissions.PERMISSION_UPDATE_SCHEDULE,
		Permissions.PERMISSION_ADD_SCHEDULE,
		Permissions.PERMISSION_DELETE_SCHEDULE,
		Permissions.PERMISSION_GET_SERVICE,
		Permissions.PERMISSION_UPDATE_SERVICE,
		Permissions.PERMISSION_ADD_SERVICE,
		Permissions.PERMISSION_DELETE_SERVICE,
		Permissions.PERMISSION_GET_RESERVATION,
		Permissions.PERMISSION_UPDATE_RESERVATION,
		Permissions.PERMISSION_ADD_RESERVATION,
		Permissions.PERMISSION_DELETE_RESERVATION,
		Permissions.PERMISSION_GET_VIP_PACKAGE,
		Permissions.PERMISSION_UPDATE_VIP_PACKAGE,
		Permissions.PERMISSION_ADD_VIP_PACKAGE,
		Permissions.PERMISSION_DELETE_VIP_PACKAGE
	)
);

export const roleValidation = Joi.string().valid(
	Role.DEVELOPER,
	Role.MANAGER,
	Role.RECEPTIONIST,
	Role.ACUPUNCTURIST,
	Role.STORE_EMPLOYEE,
	Role.OTHER
);

export const tipMethodValidation = Joi.string().valid(
	TipMethod.CASH,
	TipMethod.MACHINE,
	TipMethod.HALF
);
