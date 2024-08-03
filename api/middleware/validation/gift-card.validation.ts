import { celebrate, Joi, Segments, Modes } from 'celebrate';
import { paymentMethodValidation } from './enum.validation';
import NUMBERS from './constants/numbers.constants';
import LENGTHS from './constants/lengths.constants';
import PATTERNS from './constants/patterns.constants';

export const GetGiftCardsValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			start: Joi.date().iso(),
			end: Joi.when('start', {
				is: Joi.exist(),
				then: Joi.date().iso().min(Joi.ref('start')),
				otherwise: Joi.date().iso(),
			}),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetGiftCardValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			gift_card_id: Joi.string()
				.min(LENGTHS.gift_card.gift_card_id.min)
				.max(LENGTHS.gift_card.gift_card_id.max)
				.pattern(PATTERNS.gift_card.gift_card_id)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateGiftCardValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			gift_card_id: Joi.string()
				.min(LENGTHS.gift_card.gift_card_id.min)
				.max(LENGTHS.gift_card.gift_card_id.max)
				.pattern(PATTERNS.gift_card.gift_card_id)
				.required(),
		}),
		[Segments.BODY]: Joi.object({
			date: Joi.date().iso(),
			payment_method: paymentMethodValidation,
			payment_amount: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.gift_card.payment_amount),
		}).min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddGiftCardValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			gift_card_id: Joi.string()
				.min(LENGTHS.gift_card.gift_card_id.min)
				.max(LENGTHS.gift_card.gift_card_id.max)
				.pattern(PATTERNS.gift_card.gift_card_id)
				.required(),
			date: Joi.date().iso().required(),
			payment_method: paymentMethodValidation.required(),
			payment_amount: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.gift_card.payment_amount)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteGiftCardValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			gift_card_id: Joi.string()
				.min(LENGTHS.gift_card.gift_card_id.min)
				.max(LENGTHS.gift_card.gift_card_id.max)
				.pattern(PATTERNS.gift_card.gift_card_id)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
