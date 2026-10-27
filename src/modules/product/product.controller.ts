import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { productService } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
	const data = await productService.createProduct(req.body);

	res.status(201).json({
		success: true,
		message: "Product created successfully",
		data,
	});
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
	const data = await productService.getProducts();

	res.status(200).json({
		success: true,
		message: "Products retrieved successfully",
		data,
	});
});

const getProduct = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await productService.getProduct(id as string);

	res.status(200).json({
		success: true,
		message: "Product retrieved successfully",
		data,
	});
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await productService.updateProduct(id as string, req.body);

	res.status(200).json({
		success: true,
		message: "Product updated successfully",
		data,
	});
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await productService.deleteProduct(id as string);

	res.status(200).json({
		success: true,
		message: "Product deleted successfully",
		data,
	});
});

export const productController = {
	createProduct,
	getProducts,
	getProduct,
	updateProduct,
	deleteProduct,
};
