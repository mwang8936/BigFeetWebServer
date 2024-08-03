const LENGTHS = {
	customer: {
		phone_number: 10,
		customer_name: 60,
	},
	employee: {
		username: 30,
		password: 30,
		first_name: 30,
		last_name: 30,
	},
	gift_card: {
		gift_card_id: {
			min: 7,
			max: 8,
		},
	},
	reservation: {
		created_by: 30,
		updated_by: 30,
	},
	service: {
		service_name: 30,
		shorthand: 20,
	},
	vip_package: {
		serial: 6,
	},
};

export default LENGTHS;
