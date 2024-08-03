import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as GiftCardServices from '../services/gift-card.services';
import { formatDateToYYYYMMDD } from '../utils/date.utils';

export const getGiftCards: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: string | undefined = req.query.start
			? formatDateToYYYYMMDD(req.query.start as string)
			: undefined;
		const end: string | undefined = req.query.end
			? formatDateToYYYYMMDD(req.query.end as string)
			: undefined;

		const giftCards = await GiftCardServices.getGiftCards(start, end);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(giftCards));
	} catch (err) {
		next(err);
	}
};

export const getGiftCard: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const giftCardId = req.params.gift_card_id;

		const giftCard = await GiftCardServices.getGiftCard(giftCardId);

		if (giftCard) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(giftCard));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const updateGiftCard: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const giftCardId = req.params.gift_card_id;

		const giftCard = await GiftCardServices.updateGiftCard(
			giftCardId,
			formatDateToYYYYMMDD(req.body.date),
			req.body.payment_method,
			req.body.payment_amount
		);

		if (giftCard) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(giftCard));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const addGiftCard: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const giftCard = await GiftCardServices.addGiftCard(
			req.body.gift_card_id,
			formatDateToYYYYMMDD(req.body.date),
			req.body.payment_method,
			req.body.payment_amount
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(giftCard));
	} catch (err) {
		next(err);
	}
};

export const deleteGiftCard: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const giftCardId = req.params.gift_card_id;

		const giftCard = await GiftCardServices.deleteGiftCard(giftCardId);

		if (giftCard) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(giftCard));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
