import type { UserRole } from "../../generated/prisma/enums";

export interface AuthenticatedUser {
	userId: string;
	email: string;
	role: UserRole;
	isActive?: boolean;
}

declare global {
	namespace Express {
		interface Request {
			user: AuthenticatedUser;
		}
	}
}
