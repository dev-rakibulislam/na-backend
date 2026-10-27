
import { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { orderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
	const data = await orderService.createOrder(req.body);

	res.status(201).json({
		success: true,
		message: "Order created successfully",
		data,
	});
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
	const data = await orderService.getOrders();

	res.status(200).json({
		success: true,
		message: "Orders retrieved successfully",
		data,
	});
});

const getOrder = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await orderService.getOrder(id as string);

	res.status(200).json({
		success: true,
		message: "Order retrieved successfully",
		data,
	});
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await orderService.updateOrder(id as string, req.body);

	res.status(200).json({
		success: true,
		message: "Order updated successfully",
		data,
	});
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await orderService.deleteOrder(id as string);

	res.status(200).json({
		success: true,
		message: "Order deleted successfully",
		data,
	});
});

export const orderController = {
	createOrder,
	getOrders,
	getOrder,
	updateOrder,
	deleteOrder,
};
