import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import config from ".";

const connectionString = config.DATABASE_URL;

const adapter = new PrismaPg({
	connectionString,
});
const prisma = new PrismaClient({
	adapter,
	transactionOptions: {
		maxWait: 10000,
		timeout: 20000,
	},
});

export { prisma };
