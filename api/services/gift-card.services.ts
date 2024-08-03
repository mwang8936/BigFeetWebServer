import {
	Between,
	FindOptionsWhere,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { GiftCard } from '../models/gift-card.models';
import { PaymentMethod } from '../models/enums';

export const getGiftCards = async (start?: string, end?: string) => {
	const whereCondition: FindOptionsWhere<GiftCard>[] = [];
	if (start && end) {
		whereCondition.push({ date: Between(start, end) });
	} else if (start) {
		whereCondition.push({ date: MoreThanOrEqual(start) });
	} else if (end) {
		whereCondition.push({ date: LessThanOrEqual(end) });
	}

	return GiftCard.find({
		where: whereCondition,
	});
};

export const getGiftCard = async (giftCardId: string) => {
	return GiftCard.findOne({
		where: {
			gift_card_id: giftCardId,
		},
	});
};

export const updateGiftCard = async (
	giftCardId: string,
	date?: string,
	paymentMethod?: PaymentMethod,
	paymentAmount?: number
) => {
	const giftCard = await getGiftCard(giftCardId);

	if (giftCard) {
		const updates: Partial<GiftCard> = {};

		if (date !== undefined) {
			updates.date = date;
		}

		if (paymentMethod !== undefined) {
			updates.payment_method = paymentMethod;
		}

		if (paymentAmount !== undefined) {
			updates.payment_amount = paymentAmount;
		}

		Object.assign(giftCard, updates);

		return giftCard.save();
	} else {
		return null;
	}
};

export const addGiftCard = async (
	giftCardId: string,
	date: string,
	paymentMethod: PaymentMethod,
	paymentAmount: number
) => {
	const giftCard = GiftCard.create({
		gift_card_id: giftCardId,
		date,
		payment_method: paymentMethod,
		payment_amount: paymentAmount,
	});

	return giftCard.save();
};

export const deleteGiftCard = async (giftCardId: string) => {
	const giftCard = await getGiftCard(giftCardId);

	if (giftCard) {
		return giftCard.remove();
	} else {
		return null;
	}
};
