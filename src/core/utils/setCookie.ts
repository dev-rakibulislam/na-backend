import type { CookieOptions, Response } from "express";
import config from "../../config";

export const setCookie = (
	res: Response,
	name: string,
	value: string,
	options?: CookieOptions,
) => {
	res.cookie(name, value, {
		httpOnly: true,
		secure: config.NODE_ENV === "production",
		sameSite: "lax",
		...options,
	});
};
