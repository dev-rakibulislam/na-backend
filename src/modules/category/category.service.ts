
import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../config/prisma";

const createCategory = async (payload: Prisma.CategoryUncheckedCreateInput) => {
	return prisma.category.create({
		data: payload,
		include: {
			parent: true,
			_count: {
				select: {
					children: true,
					products: true,
				},
			},
		},
	});
};

const getCategories = async () => {
	return prisma.category.findMany({
		include: {
			parent: true,
			_count: {
				select: {
					children: true,
					products: true,
				},
			},
		},
		orderBy: {
			sortOrder: "asc",
		},
	});
};

const getCategory = async (id: string) => {
	return prisma.category.findUniqueOrThrow({
		where: { id },
		include: {
			parent: true,
			children: true,
			_count: {
				select: {
					products: true,
				},
			},
		},
	});
};

const updateCategory = async (
	id: string,
	payload: Prisma.CategoryUncheckedUpdateInput,
) => {
	return prisma.category.update({
		where: { id },
		data: payload,
		include: {
			parent: true,
			_count: {
				select: {
					children: true,
					products: true,
				},
			},
		},
	});
};

const deleteCategory = async (id: string) => {
	return prisma.category.delete({
		where: { id },
	});
};

export const categoryService = {
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
	deleteCategory,
};
