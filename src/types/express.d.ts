import type { UserRole } from "../../generated/prisma/enums";

export interface AuthenticatedUser {
		email: string;
		name: string;
		role: UserRole;
		id: string;
		is_active: never;
	}

declare global {
	namespace Express {
		interface Request {
			user: AuthenticatedUser;
		}
	}
}
