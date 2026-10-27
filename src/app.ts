import express, { type Express } from "express";

import globalErrorHandler from "./core/errors/globalErrorHandler";
import AppError from "./core/errors/appError";
import { authenticationRouter } from "./modules/authentication/authentication.route";
import { productRouter } from "./modules/product/product.route";
import { categoryRouter } from "./modules/category/category.route";

const app: Express = express();

app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   }),
// );

app.get("/", (_, res) => {
	res.status(200).send({
		message: "Hello, World!",
	});
});

app.use("/api/v1/auth", authenticationRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);

app.use((req, _, next) => {
	next(
		new AppError(
			404,
			`The requested URL \`${req.originalUrl}\` was not found on this server. That's all we know.`,
		),
	);
});

app.use(globalErrorHandler);
export default app;
