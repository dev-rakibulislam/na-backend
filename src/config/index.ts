// biome-ignore assist/source/organizeImports: <explanation>
import z from "zod";
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PORT: z.coerce.number().default(5000),
	CLIENT_URL: z.string().default("http://localhost:3000"),
	DATABASE_URL: z.string().min(1),
	JWT_ACCESS_SECRET: z.string().min(8),
	JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
	GOOGL_CLIENT_ID: z.string(),
	JWT_REFRESH_SECRET: z.string().min(8),
	JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
	BCRYPT_SALT_ROUNDS: z.coerce.number(),
	API_URL: z.string().default("http://localhost:4000"),
	SSLCOMMERZ_STORE_ID: z.string(),
	SSLCOMMERZ_STORE_PASSWD: z.string(),
	SSLCOMMERZ__PRODUCT_AMOUNT: z.coerce.number(),
	SSLCOMMERZ_CURRENCY: z.string().default("BDT"),
	SSLCOMMERZ_SUCCESS_URL: z.string(),
	SSLCOMMERZ_FAIL_URL: z.string(),
	SSLCOMMERZ_SANDBOX_API_URL: z.string(),
	SSLCOMMERZ_LIVE_API_URL: z.string(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string(),
});

export default envSchema.parse(process.env);
