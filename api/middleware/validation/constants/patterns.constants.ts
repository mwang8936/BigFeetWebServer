const PATTERNS = {
	customer: {
		phone_number: /^[0-9]+$/,
	},
	employee: {
		first_name: /^[a-zA-Z\s'-]+$/,
		last_name: /^[a-zA-Z\s'-]+$/,
	},
	vip_package: {
		serial: /^[0-9]+$/,
	},
};

export default PATTERNS;
