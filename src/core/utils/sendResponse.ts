import type { Response } from "express";
import type { ISendResponseParams } from "../../types/sendResponse.type";


export const sendResponse = (
	res: Response,
	{ code, message, data, metaData, errorDetails }: ISendResponseParams,
) => {
	return res.status(code).json({
		success: code >= 200 && code < 300,
		message,
		data,
		metaData,
		errorDetails,
	});
};
