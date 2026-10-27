
import { prisma } from "../../config/prisma";

const getWishlist = async (userId: string) => {
	return prisma.wishlist.upsert({
		where: { userId },
		create: { userId },
		update: {},
		include: {
			items: {
				include: {
					product: {
						include: {
							category: true,
							brand: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});
};

const addWishlistItem = async (userId: string, productId: string) => {
	return prisma.$transaction(async (tx) => {
		const wishlist = await tx.wishlist.upsert({
			where: { userId },
			create: { userId },
			update: {},
		});

		return tx.wishlistItem.upsert({
			where: {
				wishlistId_productId: {
					wishlistId: wishlist.id,
					productId,
				},
			},
			create: {
				wishlistId: wishlist.id,
				productId,
			},
			update: {},
			include: {
				product: {
					include: {
						category: true,
						brand: true,
					},
				},
			},
		});
	});
};

const removeWishlistItem = async (userId: string, productId: string) => {
	return prisma.wishlistItem.delete({
		where: {
			wishlistId_productId: {
				wishlistId: await getWishlistId(userId),
				productId,
			},
		},
	});
};

const getWishlistId = async (userId: string) => {
	const wishlist = await prisma.wishlist.findUniqueOrThrow({
		where: { userId },
		select: { id: true },
	});

	return wishlist.id;
};

const clearWishlist = async (userId: string) => {
	const wishlist = await prisma.wishlist.findUnique({
		where: { userId },
		select: { id: true },
	});

	if (!wishlist) {
		return { count: 0 };
	}

	return prisma.wishlistItem.deleteMany({
		where: {
			wishlistId: wishlist.id,
		},
	});
};

export const wishlistService = {
	getWishlist,
	addWishlistItem,
	removeWishlistItem,
	clearWishlist,
};
