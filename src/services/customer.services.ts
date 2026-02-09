import { In, Not } from 'typeorm';
import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { Customer } from '../models/customer.models';
import { Employee } from '../models/employee.models';
import { VipPackage } from '../models/vip-package.models';

export interface GetCustomersParams {
	page?: number;
	pageSize?: number;
	search?: string;
	withDeleted?: boolean;
}

export interface CustomerWithDetails {
	customer_id: number;
	phone_number: string | null;
	vip_serial: string | null;
	customer_name: string | null;
	notes: string | null;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
	reservations: {
		reservation_id: number;
		reserved_date: Date;
		year: number;
		month: number;
		day: number;
		date: string;
		employee_id: number;
		employee: Employee | null;
		service: {
			service_id: number;
			service_name: string;
			shorthand: string;
			time: number;
			money: number;
			body: number;
			feet: number;
			acupuncture: number;
			beds_required: number;
			color: string;
			created_at: Date;
			updated_at: Date;
			deleted_at?: Date;
		};
		time: number | null;
		beds_required: number | null;
		requested_gender: string | null;
		requested_employee: boolean;
		cash: number | null;
		machine: number | null;
		vip: number | null;
		gift_card: number | null;
		insurance: number | null;
		cash_out: number | null;
		tips: number | null;
		tip_method: string | null;
		message: string | null;
		created_by: string;
		created_at: Date;
		updated_by: string;
		updated_at: Date;
	}[];
	vip_packages: VipPackage[];
}

export interface PaginatedCustomers {
	data: CustomerWithDetails[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export const getCustomers = async (
	params: GetCustomersParams = {},
): Promise<PaginatedCustomers> => {
	const { page = 1, pageSize = 50, search, withDeleted } = params;

	const skip = (page - 1) * pageSize;

	// Use QueryBuilder to explicitly control joins and avoid circular
	// references from eager relations (Reservation eagerly loads Customer)
	const qb = Customer.createQueryBuilder('customer')
		.leftJoinAndSelect('customer.reservations', 'reservation')
		.leftJoinAndSelect('reservation.service', 'service')
		.orderBy('customer.customer_name', 'ASC')
		.addOrderBy('customer.phone_number', 'ASC')
		.addOrderBy('customer.vip_serial', 'ASC')
		.skip(skip)
		.take(pageSize);

	if (withDeleted) {
		qb.withDeleted();
	}

	if (search) {
		qb.where(
			'customer.customer_name ILIKE :search OR customer.phone_number ILIKE :search OR customer.vip_serial ILIKE :search',
			{ search: `%${search}%` },
		);
	}

	const [customers, total] = await qb.getManyAndCount();

	// Collect unique employee IDs from all reservations
	const employeeIds = [
		...new Set(
			customers.flatMap((c) => c.reservations.map((r) => r.employee_id)),
		),
	];

	// Fetch employees (including soft-deleted) and build lookup map
	const employeesMap = new Map<number, Employee>();

	if (employeeIds.length > 0) {
		const employees = await Employee.find({
			where: { employee_id: In(employeeIds) },
			withDeleted: true,
		});

		for (const emp of employees) {
			employeesMap.set(emp.employee_id, emp);
		}
	}

	// Fetch VIP packages matching customer vip_serials
	const vipSerials = customers
		.map((c) => c.vip_serial)
		.filter((s): s is string => s !== null);

	const vipPackagesMap = new Map<string, VipPackage[]>();

	if (vipSerials.length > 0) {
		const vipPackages = await VipPackage.find({
			where: { serial: In(vipSerials) },
		});

		for (const pkg of vipPackages) {
			const existing = vipPackagesMap.get(pkg.serial) || [];
			existing.push(pkg);
			vipPackagesMap.set(pkg.serial, existing);
		}
	}

	// Attach employees to reservations and vip_packages to customers
	const data = customers.map((customer) => ({
		...customer,
		reservations: customer.reservations.map((reservation) => ({
			...reservation,
			employee: employeesMap.get(reservation.employee_id) || null,
		})),
		vip_packages: customer.vip_serial
			? vipPackagesMap.get(customer.vip_serial) || []
			: [],
	}));

	return {
		data,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
};

export interface GetCustomerParams {
	customerId?: number;
	phoneNumber?: string;
	vipSerial?: string;
	withDeleted?: boolean;
}

export const getCustomer = async (params: GetCustomerParams) => {
	const { customerId, phoneNumber, vipSerial, withDeleted } = params;

	if (customerId) {
		return Customer.findOne({
			where: { customer_id: customerId },
			withDeleted,
		});
	}

	if (phoneNumber) {
		return Customer.findOne({
			where: { phone_number: phoneNumber },
			withDeleted,
		});
	}

	if (vipSerial) {
		return Customer.findOne({
			where: { vip_serial: vipSerial },
			withDeleted,
		});
	}

	return null;
};

export const updateCustomer = async (
	customerId: number,
	phoneNumber: string | null,
	vipSerial: string | null,
	customerName?: string | null,
	notes?: string | null,
) => {
	const customer = await getCustomer({ customerId });

	if (customer) {
		const updates: Partial<Customer> = {};

		if (phoneNumber !== undefined) {
			if (phoneNumber !== null) {
				await duplicatePhoneNumberChecker(phoneNumber, customerId);
			}

			updates.phone_number = phoneNumber;
		}

		if (vipSerial !== undefined) {
			if (vipSerial !== null) {
				await duplicateVipSerialChecker(vipSerial, customerId);
			}

			updates.vip_serial = vipSerial;
		}

		if (customerName !== undefined) {
			updates.customer_name = customerName;
		}

		if (notes !== undefined) {
			updates.notes = notes;
		}

		Object.assign(customer, updates);

		return customer.save();
	} else {
		return null;
	}
};

export const createCustomer = async (
	phoneNumber?: string,
	vipSerial?: string,
	customerName?: string,
	notes?: string,
) => {
	if (phoneNumber !== undefined) {
		await duplicatePhoneNumberChecker(phoneNumber);
	}

	if (vipSerial !== undefined) {
		await duplicateVipSerialChecker(vipSerial);
	}

	const customer = Customer.create({
		phone_number: phoneNumber,
		vip_serial: vipSerial,
		customer_name: customerName,
		notes,
	});

	return customer.save();
};

export const deleteCustomer = async (customerId: number) => {
	const customer = await getCustomer({ customerId, withDeleted: false });

	if (customer) {
		return customer.softRemove();
	} else {
		return null;
	}
};

export const recoverCustomer = async (customerId: number) => {
	const customer = await getCustomer({ customerId, withDeleted: true });

	if (customer) {
		if (customer.phone_number) {
			await duplicatePhoneNumberChecker(customer.phone_number);
		}

		if (customer.vip_serial) {
			await duplicateVipSerialChecker(customer.vip_serial);
		}

		return customer.recover();
	} else {
		return null;
	}
};

const duplicatePhoneNumberChecker = async (
	phoneNumber: string,
	customerId?: number,
) => {
	const duplicates = await Customer.find({
		where: {
			customer_id: customerId && Not(customerId),
			phone_number: phoneNumber,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Customer', 'Phone Number', phoneNumber);
	}
};

const duplicateVipSerialChecker = async (
	vipSerial: string,
	customerId?: number,
) => {
	const duplicates = await Customer.find({
		where: {
			customer_id: customerId && Not(customerId),
			vip_serial: vipSerial,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Customer', 'VIP Serial', vipSerial);
	}
};
