export function validateDateTimeString(
	isoDateString: string | undefined
): Date | undefined {
	if (!isoDateString) {
		return undefined;
	}

	const date = new Date(isoDateString);

	if (isNaN(date.getTime())) {
		return undefined;
	} else {
		return date;
	}
}

export function validateDateString(
	isoDateString: string | undefined
): Date | undefined {
	if (!isoDateString) {
		return undefined;
	}

	const date = new Date(isoDateString);

	if (isNaN(date.getTime())) {
		return undefined;
	} else {
		const pstDate = new Date(
			date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
		);

		return pstDate;
	}
}

export function isValidDate(year: number, month: number, day: number): boolean {
	const date = new Date(year, month - 1, day);
	return (
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day
	);
}

export function formatDateToYYYYMMDD(isoDateString: string): string {
	const date = new Date(isoDateString);

	const pstDate = new Date(
		date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
	);

	const year = pstDate.getFullYear();
	const month = String(pstDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const day = String(pstDate.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function convertDateToYearMonthDayObject(isoDateString: string): {
	year: number;
	month: number;
	day: number;
} {
	const date = new Date(isoDateString);

	const pstDate = new Date(
		date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
	);

	const year = pstDate.getFullYear();
	const month = pstDate.getMonth() + 1; // Months are 0-indexed
	const day = pstDate.getDate();

	return { year, month, day };
}
