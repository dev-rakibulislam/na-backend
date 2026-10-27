import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
	const data = await categoryService.createCategory(req.body);

	res.status(201).json({
		success: true,
		message: "Category created successfully",
		data,
	});
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
	const data = await categoryService.getCategories();

	res.status(200).json({
		success: true,
		message: "Categories retrieved successfully",
		data,
	});
});

const getCategory = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await categoryService.getCategory(id as string);

	res.status(200).json({
		success: true,
		message: "Category retrieved successfully",
		data,
	});
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await categoryService.updateCategory(id as string, req.body);

	res.status(200).json({
		success: true,
		message: "Category updated successfully",
		data,
	});
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await categoryService.deleteCategory(id as string);

	res.status(200).json({
		success: true,
		message: "Category deleted successfully",
		data,
	});
});

export const categoryController = {
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
	deleteCategory,
};
