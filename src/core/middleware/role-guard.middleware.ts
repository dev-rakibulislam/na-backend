import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../../generated/prisma/enums";
import { sendResponse } from "../utils/sendResponse";
import config from "../../config";
import AppError from "../errors/appError";
import { prisma } from "../../config/prisma";

const roleGuardMiddleware = (...requiredRoles: UserRole[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const authorizationHeader = req.headers.authorization;
		const token = authorizationHeader
			? authorizationHeader.startsWith("Bearer ")
				? authorizationHeader.split(" ")[1]
				: authorizationHeader
			: req.cookies.accessToken;

		if (!token) {
			return sendResponse(res, {
				code: 401,
				message: "Unauthorized",
			});
		}

		const { success, data, error } = verifyToken(
			token,
			config.JWT_ACCESS_SECRET,
		);

		if (!success) {
			throw new Error(error);
		}
		const { id, name, email, role, isActive } = data as JwtPayload;

		if (!id) {
			throw new AppError(404, "user Id missing");
		}

		if (requiredRoles && !requiredRoles.includes(role)) {
			throw new AppError(
				403,
				"Forbidden. You don't have permission to access this resource.",
			);
		}

		const authenticatedUser = await prisma.user.findUnique({
			where: {
				id,
				email,
				isActive,
				role,
			},
			select: {
				id: true,
				email: true,
				role: true,
				is_active: true,
				name: true,
			},
		});

		if (!authenticatedUser) {
			throw new AppError(
				401,
				"Authentication failed! Please log in again to continue",
			);
		}

		if (authenticatedUser.is_active !== false) {
			throw new AppError(403, "Account is not active. Try to active again.");
		}

		req.user = authenticatedUser;

		next();
	});
};

export default roleGuardMiddleware;
