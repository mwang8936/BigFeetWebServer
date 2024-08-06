import { Joi } from 'celebrate';

import {
	Gender,
	Language,
	PaymentMethod,
	Permissions,
	Role,
	ServiceColor,
	TipMethod,
} from '../../models/enums';

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
	Role.STORE_EMPLOYEE,
	Role.OTHER
);

export const tipMethodValidation = Joi.string().valid(
	TipMethod.CASH,
	TipMethod.MACHINE,
	TipMethod.HALF
);
