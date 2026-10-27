import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../config/prisma";
import AppError from "../../core/errors/appError";
import { generateToken, jwtCookiePayload } from "../../core/utils/jwt";
import type {
	UserLoginPayload,
	UserRegisterPayload,
} from "./authentication.interface";

const UserRegisterService = async (payload: UserRegisterPayload) => {
	const { name, email, password, phone } = payload;

	const existingUser = await prisma.user.findFirst({
		where: {
			OR: [{ email }, ...(phone ? [{ phone }] : [])],
		},
		select: {
			email: true,
			phone: true,
		},
	});

	if (existingUser) {
		if (existingUser.email === email) {
			throw new AppError(409, "Email is already registered");
		}

		throw new AppError(409, "Phone number is already registered");
	}

	const saltRounds = Number(config.BCRYPT_SALT_ROUNDS) || 12;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			passwordHash,
			phone,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			isActive: true,
			createdAt: true,
		},
	});

	// ! email verification to complete the registration process will be implemented here in future

	return { user };
};

const UserLoginService = async (payload: UserLoginPayload) => {
	const { email, password } = payload;

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new AppError(404, "User does not exist");
	}

	if (!user.isActive) {
		throw new AppError(403, "Your account is deactivated. Please contact support.");
	}

	const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
	if (!isPasswordMatch) {
		throw new AppError(401, "Invalid password credentials");
	}

	await prisma.user.update({
		where: { id: user.id },
		data: { lastLoginAt: new Date() },
	});

	const tokenPayload = await jwtCookiePayload(user);

	const accessToken = await generateToken(tokenPayload, {
		secret: config.JWT_ACCESS_SECRET,
		expiresIn: config.JWT_ACCESS_EXPIRES_IN,
	});

	const refreshToken = await generateToken(tokenPayload, {
		secret: config.JWT_REFRESH_SECRET,
		expiresIn: config.JWT_REFRESH_EXPIRES_IN,
	});

	const { passwordHash: _, ...userWithoutPassword } = user;

	return {
		user: userWithoutPassword,
		accessToken,
		refreshToken,
	};
};

export const authenticationService = {
	UserRegisterService,
	UserLoginService,
};
