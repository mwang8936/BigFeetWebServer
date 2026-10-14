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

/**
 * Returns the current year, month and day in PST, since the store always
 * operates on PST days regardless of where the server is running.
 */
export function getCurrentPSTDate(): {
	year: number;
	month: number;
	day: number;
} {
	return convertDateToYearMonthDayObject(new Date().toISOString());
}

/**
 * Checks whether a PST calendar date has already ended, meaning it falls before
 * the day that is currently in progress in PST. The day is over at 12AM PST.
 */
export function isPastPSTDate(date: {
	year: number;
	month: number;
	day: number;
}): boolean {
	const today = getCurrentPSTDate();

	const dateValue = date.year * 10000 + date.month * 100 + date.day;
	const todayValue = today.year * 10000 + today.month * 100 + today.day;

	return dateValue < todayValue;
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

/**
 * Formats a Date into the 'HH:mm:ss' string used by the `time` columns. Needed for
 * values stored inside jsonb, where TypeORM does not do the conversion for us. Reads
 * the local clock fields, matching what validateDateString above hands back.
 */
export function formatTimeToHHMMSS(date: Date): string {
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${hours}:${minutes}:${seconds}`;
}
