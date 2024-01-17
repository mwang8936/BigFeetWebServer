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
