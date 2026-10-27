import { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { wishlistService } from "./wishlist.service";

const getWishlist = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.userId;

	const data = await wishlistService.getWishlist(userId);

	res.status(200).json({
		success: true,
		message: "Wishlist retrieved successfully",
		data,
	});
});

const addWishlistItem = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.userId;
	const { productId } = req.body;

	const data = await wishlistService.addWishlistItem(userId, productId);

	res.status(201).json({
		success: true,
		message: "Product added to wishlist successfully",
		data,
	});
});

const removeWishlistItem = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.userId;
	const { productId } = req.params;

	const data = await wishlistService.removeWishlistItem(
		userId,
		productId as string,
	);

	res.status(200).json({
		success: true,
		message: "Product removed from wishlist successfully",
		data,
	});
});

const clearWishlist = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.userId;

	const data = await wishlistService.clearWishlist(userId);

	res.status(200).json({
		success: true,
		message: "Wishlist cleared successfully",
		data,
	});
});

export const wishlistController = {
	getWishlist,
	addWishlistItem,
	removeWishlistItem,
	clearWishlist,
};
