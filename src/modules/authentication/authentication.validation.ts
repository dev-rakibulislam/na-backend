
import z from "zod";
import { UserRole } from "../../../generated/prisma/enums";

export const bangladeshPhoneSchema = z
	.string()
	.trim()
	.regex(
		/^(?:\+8801|8801|01)[3-9]\d{8}$/,
		"Please provide a valid Bangladesh mobile number",
	);

export const userLoginSchema = z.object({
	email: z.email({
		error: (i) =>
			i.input == null ? "Email is required" : "Please provide a valid email",
	}),

	password: z
		.string("Password is required")
		.min(6, "Password must be at least 6 characters long")
		.max(32, "Password must be less than 32 characters long"),
});

export const userRegisterSchema = userLoginSchema.extend({
	name: z
		.string({
			error: (i) =>
				i.input == null ? "Name is required" : "Name must be a string",
		})
		.trim()
		.min(3, "Name must be at least 3 characters long")
		.max(255, "Name must be less than 255 characters long"),

	phone: bangladeshPhoneSchema.optional(),

	role: z.enum(UserRole).default("CUSTOMER"),
});

export const technicianProfileUpdateSchema = z.object({});

