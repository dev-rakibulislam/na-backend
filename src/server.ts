import config from "./config";
import express, { type Express } from "express";

const app: Express = express();
async function startServer() {
	try {
		// await prisma.$connect();
		// console.log("database connected successfully.");
		// await seedIntoDB();
		// for dummy data max 1 time for storage
		// await main()
		app.listen(config.PORT, () => {
			console.log(`running on => http://127.0.0.1:${config.PORT}`);
		});
	} catch (error) {
		// await prisma.$disconnect();
		console.dir(error);
	}
}
startServer();
