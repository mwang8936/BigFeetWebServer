export function convertDateToPSTDateTime(date: Date): Date {
	const PSTDate = new Date(date);
	PSTDate.setUTCHours(8);

	return PSTDate;
}

export function setTimeToZero(date: Date): Date {
	const noTimeDate = new Date(date);

	noTimeDate.setHours(0);
	noTimeDate.setMinutes(0);
	noTimeDate.setSeconds(0);
	noTimeDate.setMilliseconds(0);

	return noTimeDate;
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
		return date;
	}
}

export function formatDateToYYYYMMDD(isoDateString: string): string {
	const date = new Date(isoDateString);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
