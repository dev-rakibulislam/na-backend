import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/appError";
import config from "../../config";
import { prisma } from "../../config/prisma";

const authGuardMiddleware = () => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const authorizationHeader = req.headers.authorization;

		const token = authorizationHeader?.startsWith("Bearer ")
			? authorizationHeader.slice(7)
			: authorizationHeader || req.cookies?.accessToken;

		if (!token) {
			return sendResponse(res, {
				code: 401,
				message: "Unauthorized",
			});
		}

		const { success, data } = verifyToken(token, config.JWT_ACCESS_SECRET);

		if (!success) {
			throw new AppError(401, "Invalid or expired access token.");
		}

		const { id } = data as JwtPayload;

		if (!id) {
			throw new AppError(401, "Invalid token payload.");
		}

		const authenticatedUser = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				role: true,
				isActive: true,
				name: true,
			},
		});

		if (!authenticatedUser) {
			throw new AppError(401, "User not found. Please log in again.");
		}

		if (!authenticatedUser.isActive) {
			throw new AppError(403, "Account is inactive.");
		}

		req.user = authenticatedUser;

		next();
	});
};

export default authGuardMiddleware;
