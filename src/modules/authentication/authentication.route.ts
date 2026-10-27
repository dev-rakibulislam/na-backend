import { Router } from "express";
import { validateData } from "../../core/middleware/zodDataValidator.middleware";
import { authenticationController } from "./authentication.controller";
import {
	userLoginSchema,
	userRegisterSchema,
} from "./authentication.validation";

const router = Router();

router.post(
	"/register",
	validateData(userRegisterSchema),
	authenticationController.UserRegisterController,
);

router.post(
	"/login",
	validateData(userLoginSchema),
	authenticationController.UserLoginController,
);

router.get("/me", authenticationController.getMyProfileController);

export const authenticationRouter = router;
