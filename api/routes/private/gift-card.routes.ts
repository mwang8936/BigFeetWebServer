import { Router } from 'express';
import {
	addGiftCard,
	deleteGiftCard,
	getGiftCard,
	getGiftCards,
	updateGiftCard,
} from '../../controllers/gift-card.controller';
import { Permissions } from '../../models/enums';
import {
	AddGiftCardValidation,
	DeleteGiftCardValidation,
	GetGiftCardValidation,
	GetGiftCardsValidation,
	UpdateGiftCardValidation,
} from '../../middleware/validation/gift-card.validation';
import authorize from '../../middleware/authentication.middleware';

const router = Router();

router
	.route('/')
	.get(
		authorize([Permissions.PERMISSION_GET_GIFT_CARD]),
		GetGiftCardsValidation,
		getGiftCards
	);
router
	.route('/:gift_card_id')
	.get(
		authorize([Permissions.PERMISSION_GET_GIFT_CARD]),
		GetGiftCardValidation,
		getGiftCard
	);
router
	.route('/:gift_card_id')
	.patch(
		authorize([Permissions.PERMISSION_UPDATE_GIFT_CARD]),
		UpdateGiftCardValidation,
		updateGiftCard
	);
router
	.route('/')
	.post(
		authorize([Permissions.PERMISSION_ADD_GIFT_CARD]),
		AddGiftCardValidation,
		addGiftCard
	);
router
	.route('/:gift_card_id')
	.delete(
		authorize([Permissions.PERMISSION_DELETE_GIFT_CARD]),
		DeleteGiftCardValidation,
		deleteGiftCard
	);

export default router;
