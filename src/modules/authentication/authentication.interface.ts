import z from "zod";
import {
	userLoginSchema,
	userRegisterSchema,
} from "./authentication.validation";

export type UserLoginPayload = z.infer<typeof userLoginSchema>;
export type UserRegisterPayload = z.infer<typeof userRegisterSchema>;
