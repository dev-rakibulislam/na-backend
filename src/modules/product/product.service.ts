import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../config/prisma";

const createProduct = async (payload: Prisma.ProductUncheckedCreateInput) => {
	return prisma.product.create({
		data: payload,
		include: {
			category: true,
			brand: true,
		},
	});
};

const getProducts = async () => {
	return prisma.product.findMany({
		include: {
			category: true,
			brand: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const getProduct = async (id: string) => {
	return prisma.product.findUniqueOrThrow({
		where: { id },
		include: {
			category: true,
			brand: true,
		},
	});
};

const updateProduct = async (
	id: string,
	payload: Prisma.ProductUpdateInput,
) => {
	return prisma.product.update({
		where: { id },
		data: payload,
		include: {
			category: true,
			brand: true,
		},
	});
};

const deleteProduct = async (id: string) => {
	return prisma.product.delete({
		where: { id },
	});
};

export const productService = {
	createProduct,
	getProducts,
	getProduct,
	updateProduct,
	deleteProduct,
};
