import type { JwtPayload } from "jsonwebtoken";

export type TJwtPayload = JwtPayload & {
	userId: string;
	email: string;
	role: string;
	isActive?: boolean;

};

export type TJwtData = {
	secret: string;
	expiresIn: string;
};
