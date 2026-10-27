import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/sendResponse";
import { setCookie } from "../../core/utils/setCookie";
import { authenticationService } from "./authentication.service";

const UserRegisterController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await authenticationService.UserRegisterService(req.body);

		sendResponse(res, {
			code: 201,
			message:
				"User registered successfully. You Need to verify your email to complete the registration process.",
			data,
		});
	},
);

const UserLoginController = catchAsync(async (req: Request, res: Response) => {
	const { user, accessToken, refreshToken } =
		await authenticationService.UserLoginService(req.body);

	setCookie(res, "accessToken", accessToken, {
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	setCookie(res, "refreshToken", refreshToken, {
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	});

	sendResponse(res, {
		code: 200,
		message: "User login successfully.",
		data: {
			user,
			accessToken,
			refreshToken,
		},
	});
});

export const authenticationController = {
	UserRegisterController,
	UserLoginController,
};
