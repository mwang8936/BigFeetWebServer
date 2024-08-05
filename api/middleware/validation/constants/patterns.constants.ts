const PATTERNS = {
	customer: {
		phone_number: /^[0-9]+$/,
		vip_serial: /^[0-9]+$/,
	},
	employee: {
		first_name: /^[a-zA-Z\s'-]+$/,
		last_name: /^[a-zA-Z\s'-]+$/,
	},
	gift_card: {
		gift_card_id: /^T\d{6,7}$/,
	},
	vip_package: {
		serial: /^[0-9]+$/,
	},
};

export default PATTERNS;
