import type { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums";

export type TJwtPayload = JwtPayload & {
	id: string;
	email: string;
	role: UserRole;
	isActive: boolean;
};

export type TJwtData = {
	secret: string;
	expiresIn: string;
};
