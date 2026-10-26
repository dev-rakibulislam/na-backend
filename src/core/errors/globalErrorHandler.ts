import type { NextFunction, Request, Response } from "express";

import config from "../../config";
import { sendResponse } from "../utils/sendResponse";
import AppError from "./appError";

const globalErrorHandler = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	config.NODE_ENV === "development" && console.error("Developer Only:",error);

  if (error instanceof AppError) {
    console.log("AppError:", error);
			return sendResponse(res, {
				code: error.statusCode,
				message: error.message,
				errorDetails: error?.errorDetails,
			});
		}

	// if (error instanceof ZodError) {
	// 	const { statusCode, errors, message } = handleZodError(error);
	// 	return sendResponse(res, {
	// 		code: statusCode,
	// 		message: message,
	// 		errorDetails: errors,
	// 	});
	// }



	if (error.type === "entity.parse.failed") {
		return sendResponse(res, {
			code: error.statusCode,
			message: error.message,
			errorDetails: "Invalid JSON format",
		});
	}

	// if (error instanceof PrismaClientKnownRequestError) {
	// 	const simplifiedError = handlePrismaError(error);

	// 	return sendResponse(res, {
	// 		code: simplifiedError.statusCode,
	// 		message: simplifiedError.message,
	// 		errorDetails: simplifiedError.errors,
	// 	});
	// }

	// if (error instanceof PrismaClientValidationError) {
	// 	return sendResponse(res, {
	// 		code: 400,
	// 		message: "Database validation error",
	// 		errorDetails: [
	// 			{
	// 				path: "database",
	// 				message: error.message,
	// 			},
	// 		],
	// 	});
	// }

	sendResponse(res, {
		code: 500,
		errorDetails: error,
		message: "Something went wrong",
	});
};

export default globalErrorHandler;
