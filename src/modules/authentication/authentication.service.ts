import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../config/prisma";
import AppError from "../../core/errors/appError";
import { generateToken, jwtCookiePayload } from "../../core/utils/jwt";
import type {
	UserLoginPayload,
	UserRegisterPayload,
} from "./authentication.interface";
import { AuthenticatedUser } from "../../types/express";

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
	const existingUserRecord = await prisma.user.findUnique({
		where: {
			email: payload.email,
		},
	});

	if (existingUserRecord === null) {
		throw new AppError(409, "user not found. Please register");
	}
	const { passwordHash: passwordDB } = existingUserRecord;

	const isPasswordMatch = await bcrypt.compare(payload.password, passwordDB);

	if (!isPasswordMatch) {
		throw new AppError(401, "Invalid credentials");
	}

	const { email, id, isActive, role } =
		await jwtCookiePayload(existingUserRecord);

	const JwtPayload = { email, id, isActive, role };

	const accessToken = await generateToken(JwtPayload, {
		expiresIn: config.JWT_ACCESS_EXPIRES_IN,
		secret: config.JWT_ACCESS_SECRET,
	});

	const refreshToken = await generateToken(JwtPayload, {
		secret: config.JWT_REFRESH_SECRET,
		expiresIn: config.JWT_REFRESH_EXPIRES_IN,
	});

	return { accessToken, refreshToken };
};

const getProfileFromDb = async (payload: AuthenticatedUser) => {
	console.log("ppaa", payload);
	const getProfile = await prisma.user.findUnique({
		where: {
			...payload,
		},
		omit: { passwordHash: true },
	});
	return getProfile;
};

export const authenticationService = {
	UserRegisterService,
	UserLoginService,
	getProfileFromDb,
};
