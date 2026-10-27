
import { Prisma, ProductStatus } from "../../../generated/prisma/client";
import { prisma } from "../../config/prisma";

type CreateOrderInput = {
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	shippingAddress: Prisma.InputJsonValue;
	paymentMethod: "cod" | "sslcommerz";
	deliveryCharge?: number;
	discountTotal?: number;
	couponCode?: string;
	note?: string;
	items: {
		productId: string;
		quantity: number;
	}[];
};

const createOrder = async (payload: CreateOrderInput) => {
	if (!payload.items?.length) {
		throw new Error("Order must contain at least one item");
	}

	const productIds = payload.items.map((item) => item.productId);

	if (new Set(productIds).size !== productIds.length) {
		throw new Error("Duplicate products are not allowed");
	}

	for (const item of payload.items) {
		if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
			throw new Error("Quantity must be a positive integer");
		}
	}

	return prisma.$transaction(async (tx) => {
		const products = await tx.product.findMany({
			where: {
				id: { in: productIds },
				status: ProductStatus.active,
			},
			select: {
				id: true,
				name: true,
				unitPrice: true,
			},
		});

		if (products.length !== productIds.length) {
			throw new Error("One or more products are unavailable");
		}

		const productMap = new Map(
			products.map((product) => [product.id, product]),
		);

		const items = payload.items.map((item) => {
			const product = productMap.get(item.productId)!;
			const unitPrice = new Prisma.Decimal(product.unitPrice);
			const lineTotal = unitPrice.mul(item.quantity);

			return {
				productId: product.id,
				productName: product.name,
				unitPrice,
				quantity: item.quantity,
				lineTotal,
			};
		});

		const subtotal = items.reduce(
			(total, item) => total.add(item.lineTotal),
			new Prisma.Decimal(0),
		);

		const deliveryCharge = new Prisma.Decimal(payload.deliveryCharge ?? 0);
		const discountTotal = new Prisma.Decimal(payload.discountTotal ?? 0);

		if (
			deliveryCharge.isNegative() ||
			discountTotal.isNegative() ||
			discountTotal.greaterThan(subtotal)
		) {
			throw new Error("Invalid discount or delivery charge");
		}

		const grandTotal = subtotal.minus(discountTotal).plus(deliveryCharge);

		return tx.order.create({
			data: {
				orderNumber: `ORD-${crypto.randomUUID()}`,
				userId: null,
				customerName: payload.customerName,
				customerPhone: payload.customerPhone,
				customerEmail: payload.customerEmail,
				shippingAddress: payload.shippingAddress,
				subtotal,
				discountTotal,
				deliveryCharge,
				grandTotal,
				couponCode: payload.couponCode,
				paymentMethod: payload.paymentMethod,
				note: payload.note,
				placedAt: new Date(),
				items: {
					create: items,
				},
			},
			include: {
				items: true,
			},
		});
	});
};

const getOrders = async () => {
	return prisma.order.findMany({
		include: {
			items: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const getOrder = async (id: string) => {
	return prisma.order.findUniqueOrThrow({
		where: { id },
		include: {
			items: true,
		},
	});
};

const updateOrder = async (id: string, payload: Prisma.OrderUpdateInput) => {
	return prisma.order.update({
		where: { id },
		data: payload,
		include: {
			items: true,
		},
	});
};

const deleteOrder = async (id: string) => {
	return prisma.order.delete({
		where: { id },
	});
};

export const orderService = {
	createOrder,
	getOrders,
	getOrder,
	updateOrder,
	deleteOrder,
};
