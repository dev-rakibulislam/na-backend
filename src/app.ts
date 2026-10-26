
import express, { type Express } from "express";
import cors from "cors"

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.get("/", (_, res) => {
	res
		.status(200)
		.send({
			message: "Hello, World!",
			apiDocumentation:
				"https://documenter.getpostman.com/view/45059890/2sBYAsysNh",
		});
});

// app.use("/api/v1/auth", authRouter);


app.use(globalErrorHandler);

app.use((req, _, next) => {
	next(
		new AppError(
			404,
			`Cannot ${req.method} ${req.originalUrl}. maybe this does not exist or you are not authorized to access this route`,
		),
	);
});

export default app;
