import type { UserRole } from "../../generated/prisma/enums";

export interface AuthenticatedUser {
		email: string;
		name: string;
		role: UserRole;
		id: string;
		isActive: boolean;
	}

declare global {
	namespace Express {
		interface Request {
			user: AuthenticatedUser;
		}
	}
}
